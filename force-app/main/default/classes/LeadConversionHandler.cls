public class LeadConversionHandler {
    public static void AfterUpdate(List<Lead> lstLeads){
        List<Database.LeadConvert> leadConverts = new List<Database.LeadConvert>();

        LeadStatus lsstatus = [SELECT Id, MasterLabel, IsConverted, IsDefault FROM LeadStatus where IsConverted=true];
        for (Lead lead : lstLeads) {
            System.debug('Started ---> '+lead.Id);
            if (lead.IsConverted==false && lead.Approval_Status__c == 'Approved') {
                User u = [select Id, Name from User where Id =: UserInfo.getUserId()];
                // Only convert leads that have been approved and not already converted
                Database.LeadConvert lc = new Database.LeadConvert();
                lc.setLeadId(lead.Id);
                
                String leadOwner = lead.OwnerId;
                if(leadOwner.startsWith('00G')){
                    lc.setOwnerId(u.Id);
                }
                lc.setSendNotificationEmail(true);
                lc.setOpportunityName(lead.Company+' Opportunity');
                lc.setDoNotCreateOpportunity(false);
                lc.setConvertedStatus(lsstatus.MasterLabel);
    
                leadConverts.add(lc);
            }
        }
    
        if (!leadConverts.isEmpty()) {
            // Perform the lead conversion
            List<Database.LeadConvertResult> lcrList = Database.convertLead(leadConverts, false);
            System.debug('lcrList '+lcrList);
            // Process the converted records
            for (Database.LeadConvertResult result : lcrList) {
                if (result.isSuccess()) {
                    // Retrieve converted records
                    Account convertedAccount = [SELECT Id, Name, OwnerId FROM Account WHERE Id = :result.getAccountId()];
                    Contact convertedContact = [SELECT Id, Name, OwnerId, Email, LastName,FirstName FROM Contact WHERE Id = :result.getContactId()];
                    Opportunity convertedOpportunity = [SELECT Id, OwnerId, Name FROM Opportunity WHERE Id = :result.getOpportunityId()];
    
                    // Mark account as partner
                    convertedAccount.IsPartner = true;
                    update convertedAccount;
                    
                    Id profileId = [SELECT Id FROM Profile where Name='Partner Community User'][0].Id;
                    System.debug(profileId);
                    User portalUser = new User(
                    ContactId = convertedContact.Id,
                    Username = 'User' + Math.random()*100 + '@test.com',
                    Email = convertedContact.Email,
                    LastName = convertedContact.LastName,
                    FirstName = convertedContact.FirstName,
                    Alias = convertedContact.FirstName.substring(0, 1) + convertedContact.LastName.substring(0, 1),
                    CommunityNickname = convertedContact.FirstName + '_' + convertedContact.LastName,
                    ProfileId = profileId, // 00e5h000005SJws
                    LanguageLocaleKey = 'en_US',
                    LocaleSidKey = 'en_IN',
                    EmailEncodingKey = 'ISO-8859-1',
                    TimeZoneSidKey = 'Asia/Kolkata',
                    IsActive = true
                	);
        
                	insert portalUser;
                        
                    Boolean sendResult = true;
                    
                    // Send an email notification to the contact person
                    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                    mail.setToAddresses(new String[]{portalUser.Email});
                    mail.setSubject('Welcome to the Portal');
                    mail.setPlainTextBody('Dear ' + portalUser.FirstName + ',\nLead has been converted successfully into \n'+
                                         'Account: '+convertedAccount.Name+',\nContact: '+convertedContact.Name+
                                         ',\nOpportunity: '+convertedOpportunity.Name);
                    // Send email
                    Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});
                    for(Messaging.SendEmailResult res:results){
                        if(res.isSuccess()){
                            System.debug('Email sent');
                        }
                        else{
                            sendResult=false;
                            System.debug('Email not sent');
                        }
                    }
            	}
        	}
    	}
    }
}
