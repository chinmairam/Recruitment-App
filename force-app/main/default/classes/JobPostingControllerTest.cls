@isTest
public class JobPostingControllerTest {
    @isTest
    static void testGetJobPostings() {
        // Create test data
        List<Job_Posting__c> jobPostings = new List<Job_Posting__c>();
        for (Integer i = 0; i < 5; i++) {
            Job_Posting__c jobPosting = new Job_Posting__c(
                Name = 'Job Posting ' + i,
                Department__c = 'IT',
                Location__c = 'Test Location',
                Job_Description__c = 'Test Job Description',
                Application_Deadline__c = Date.today().addDays(30),
                Status__c = 'Open'
            );
            jobPostings.add(jobPosting);
        }
        insert jobPostings;

        Test.startTest();
        List<Job_Posting__c> result = JobPostingController.getJobPostings();
        Test.stopTest();

        // Verify the result
        System.assertEquals(5, result.size(), 'Number of job postings should be 5');
    }
}