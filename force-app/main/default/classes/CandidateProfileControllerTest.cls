@isTest
public class CandidateProfileControllerTest {
    @isTest
    static void testGetVerificationStatus() {
        // Create a test CandidateProfile__c record
        CandidateProfile__c testCandidateProfile = new CandidateProfile__c(
            Verification_Status__c = 'Pending',
            Name='PSPK',
            Email__c='pspk@gmail.com',
            Address__c = 'India',
            MobileNo__c = '9387488484'
        );
        insert testCandidateProfile;

        // Call the getVerificationStatus method in the CandidateProfileController class
        String verificationStatus = CandidateProfileController.getVerificationStatus(testCandidateProfile.Id);

        // Verify that the returned verification status is as expected
        System.assertEquals('Pending', verificationStatus);
    }
}