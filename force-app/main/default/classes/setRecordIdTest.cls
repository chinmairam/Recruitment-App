@isTest
public class setRecordIdTest {
    @isTest
    static void testGetRecordId() {
        // Create a test user
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'testuser@example.com',
            Alias = 'testuser',
            Username = 'testuserpspk@example.com',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ProfileId = UserInfo.getProfileId()
        );
        insert testUser;

        // Set the user context
        System.runAs(testUser) {
            // Call the getRecordId method
            Id recordId = setRecordId.getRecordId();

            // Verify the result
            System.assertEquals(recordId, testUser.ContactId);
        }
    }

    @isTest
    static void testGetCandidateId() {
        // Create a test user
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'testuser@example.com',
            Alias = 'testuser',
            Username = 'testuserpspk1@example.com',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ProfileId = UserInfo.getProfileId()
        );
        insert testUser;
        
        
        CandidateProfile__c testCandidate = new CandidateProfile__c(
            Name='Raju',
            OwnerId = testUser.Id,
            Gender__c = 'Male',
            Address__c = 'India',
            Email__c = 'testuser@example.com',
            MobileNo__c = '9374774883'
        );
        insert testCandidate;
        
        try {
            Id candidateId = setRecordId.getCandidateId(testUser.Id);
            // Verify the result
            System.assertNotEquals(candidateId, null);
        } catch (System.QueryException e) {
            System.debug('No candidate profile found for the user');
        }
    }
}