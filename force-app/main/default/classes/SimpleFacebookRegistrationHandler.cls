/**
  FaceBook Registration Handler
**/
public with sharing class SimpleFacebookRegistrationHandler implements Auth.RegistrationHandler{
    
    private static final String ORG_SUFFIX = '.sso.facebook.org';
    private static final String DEFAULT_ACCOUNTNAME = 'Facebook';
    private static final String EXTERNAL_USER_PROFILE = 'Customer Community User';
    private static final String INTERNAL_USER_PROFILE = 'Standard User';    
    
    /**
     * Let anyone register as long as the required fields are supplied
     * 
     * We require email, lastName, firstName
     * 
     * @data - the user's info from the Auth Provider
     **/ 
    public boolean canCreateUser(Auth.UserData data) {
        System.debug('canCreateUser was called for ' + (data != null ? data.email : 'null'));
        Boolean retVal = (data != null 
                && data.email != null
                && data.lastName != null
                && data.firstName != null);
        
        return retVal;
    }
    
    /**
     * Create the User - A required method to implement the Handler Interface
     * 
     * @param portalId  - Id of the Community
     * @param data - Auth Provider user data describing the User to create
     * 
     * @return User that has been initialized
    **/ 
    public User createUser(Id portalId, Auth.UserData data){
        if(!canCreateUser(data)) {
            // Returning null signals the auth framework we can't create the user
            return null;
        }
        
        // Is this a Community Context?
        if(data.attributeMap.containsKey('sfdc_networkid')) {
            Id contactId;
            // To keep things modular, we're creating the Contact in a separate method
            contactId = createContact(data);
            
            // You'd likely use other logic to assign the Profile
            Profile p = [SELECT Id 
                         FROM profile 
                         WHERE name=:EXTERNAL_USER_PROFILE WITH SECURITY_ENFORCED];
    
            // Keeping it modular, we initialize the user in another method
            User u = createUser(data,p);
            
            u.contactId = contactId;
            return u;
        } else {
            //This is not a community, so we Assign an internal profile
            Profile p = [SELECT Id 
                        FROM profile 
                        WHERE name=:INTERNAL_USER_PROFILE WITH SECURITY_ENFORCED];
            
            // Keeping it modular, we initialize the user in another method
            User u = createUser(data,p);
    
            return u;
        }
    }
    
    /**
     * Update the user
     * @param portalId  - Id of the Community
     * @param data - Auth Provider user data describing the User to create
     **/     
    public void updateUser(Id userId, Id portalId, Auth.UserData data){
        String alias = data.firstName+data.lastName;
        
        Database.SaveResult[] srList = Database.update( new User(
            id=userId,
            email = data.email,
            lastName = data.lastName,
            firstName = data.firstName,
            languagelocalekey = UserInfo.getLocale(),
            localesidkey = UserInfo.getLocale(),
            emailEncodingKey = 'UTF-8',
            timeZoneSidKey = 'America/Los_Angeles',
            alias = (alias.length()>8) ? alias.substring(0, 8) : alias
        ), false);
        for (Database.SaveResult sr : srList) {
            if (sr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully updated user. User ID: ' + sr.getId());
            }
            else {
                // Operation failed, so get all errors                
                for(Database.Error err : sr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Fields that affected this error: ' + err.getFields());
                }
            }
        }
    }

    /**
    * Create a Contact
    * 
    * @param data - Facebook provided context for the User
    **/
    private Id createContact(Auth.UserData data){
        Contact contact1 = new Contact();
        contact1.LastName = data.lastName;
        contact1.FirstName = data.firstName;
        contact1.Email = data.email;
        
        // set Account Id
        if (data.attributemap.get('accountId') != null){
            contact1.accountId = data.attributemap.get('accountId');
        } else {
            List<Account> accounts = [select Id 
                                      from Account 
                                      where Name =:DEFAULT_ACCOUNTNAME WITH SECURITY_ENFORCED];
            
            contact1.accountId = accounts[0].Id;            
        }
        if(Contact.SObjectType.getDescribe().isCreateable()){
            insert contact1;
        }        
        return contact1.id; 
    }
    
        
    /**
    * Create and initialize the User but don't save it yet
    * 
    * @param data - the provided User context from FaceBook
    * @param p - the Profile we are going to assign to this user
    * 
    * @return User that has been initialized but not Saved
    **/ 
    private User createUser(Auth.UserData data, Profile p) {
        User u = new User();
        u.username = data.email + ORG_SUFFIX;
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.firstName + data.lastName;
        
        //Alias must be 8 characters or less
        if(alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = UserInfo.getLanguage();
        u.localesidkey = UserInfo.getLocale();
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.profileId = p.Id;
        return u;
    }        
}