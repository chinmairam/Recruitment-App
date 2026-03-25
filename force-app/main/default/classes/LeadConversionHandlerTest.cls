@isTest
public class LeadConversionHandlerTest {
	@isTest
    static void testLeadConversion() {
        Lead lead = new Lead();
        lead.FirstName = 'Test';
        lead.LastName = 'Lead';
        lead.Company = 'Test Company';
        lead.Region__c = 'South';
        lead.Email = 'test@gmail.com';
        insert lead;
        
        Test.startTest();
        lead.Status = 'Closed - Converted';
        lead.Approval_Status__c = 'Approved';
        update lead;
        Test.stopTest();
        
        // Get the converted lead
        Lead convertedLead = [SELECT Id, IsConverted, ConvertedAccountId, ConvertedContactId, ConvertedOpportunityId, ConvertedDate FROM Lead WHERE Id = :lead.Id LIMIT 1];
        System.assertEquals(true, convertedLead.IsConverted);
        
        Account account = [SELECT Id, Name, IsPartner FROM Account WHERE Id = :convertedLead.ConvertedAccountId LIMIT 1];
        System.assertEquals(lead.Company, account.Name, 'Account name should match Lead Company');
        System.assertEquals(account.IsPartner, true);

        Contact contact = [SELECT Id, FirstName, LastName, AccountId FROM Contact WHERE Id = :convertedLead.ConvertedContactId LIMIT 1];
        System.assertEquals(lead.Company, account.Name, 'Contact account should match Lead Company');
        System.assertEquals(lead.FirstName, contact.FirstName, 'Contact first name should match Lead first name');
        System.assertEquals(lead.LastName, contact.LastName, 'Contact last name should match Lead last name');

        Opportunity opportunity = [SELECT Id, AccountId, ContactId FROM Opportunity WHERE Id = :convertedLead.ConvertedOpportunityId LIMIT 1];
        System.assertEquals(lead.Company, account.Name, 'Opportunity account should match Lead Company');
        System.assertEquals(contact.Id, opportunity.ContactId, 'Opportunity contact should match Lead contact');
    }
}