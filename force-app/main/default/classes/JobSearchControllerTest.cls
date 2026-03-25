@isTest
private class JobSearchControllerTest {
    @isTest
    static void testGetJobListings() {
        // Test with valid parameters
        RestRequest request = new RestRequest();
        request.params.put('location', 'Delhi');
        request.params.put('industry', 'Marketing');
        request.params.put('jobType', 'Internship');

        RestContext.request = request;

        List<JobListing__c> jobListings = JobSearchController.getJobListings();
        System.assertNotEquals(null, jobListings, 'Job Listing shouldnt be null');
    }

    @isTest
    static void testCreateJobListing() {
        // Test with valid parameters
        JobListing__c newJob = JobSearchController.createJobListing('Test Company', 'TestTitle', 'Hyderabad', 'Engineering', 'Part-time');
        System.assertNotEquals(null, newJob, 'Job Listing shouldnt be null');
    }
    
    @isTest
    static void testCreateJobListingWithBlankCompany() {
        // Test with a blank title, should throw an exception
        try {
            JobSearchController.createJobListing('', 'Test', 'Mumbai', 'Engineering', 'Internship');
            // The line below should not be reached if an exception is thrown
            System.assert(false, 'Expected exception but got none.');
        } catch (JobSearchController.JobSearchException e) {
            // Expected exception, do nothing
            System.assertEquals('Company is required', e.getMessage(), 'Unexpected error message for blank company');
        }
    }

    @isTest
    static void testCreateJobListingWithBlankTitle() {
        // Test with a blank title, should throw an exception
        try {
            JobSearchController.createJobListing('SF', '', 'Mumbai', 'Engineering', 'Internship');
            // The line below should not be reached if an exception is thrown
            System.assert(false, 'Expected exception but got none.');
        } catch (JobSearchController.JobSearchException e) {
            // Expected exception, do nothing
            System.assertEquals('Title is required', e.getMessage(), 'Unexpected error message for blank title');
        }
    }
    
    @isTest
    static void testCreateJobListingWithBlankLocation() {
        // Test with a blank location, should throw an exception
        try {
            JobSearchController.createJobListing('SF', 'Test', '', 'Engineering', 'Internship');
            // The line below should not be reached if an exception is thrown
            System.assert(false, 'Expected exception but got none.');
        } catch (JobSearchController.JobSearchException e) {
            System.assertEquals('Location is required', e.getMessage(), 'Unexpected error message for blank location');
        }
    }

    @isTest
    static void testCreateJobListingWithBlankIndustry() {
        // Test with a blank industry, should throw an exception
        try {
            JobSearchController.createJobListing('SF', 'Test', 'Mumbai', '', 'Internship');
            // The line below should not be reached if an exception is thrown
            System.assert(false, 'Expected exception but got none.');
        } catch (JobSearchController.JobSearchException e) {
            System.assertEquals('Industry is required', e.getMessage(), 'Unexpected error message for blank industry');
        }
    }

    @isTest
    static void testCreateJobListingWithBlankJobType() {
        // Test with a blank jobType, should throw an exception
        try {
            JobSearchController.createJobListing('SF', 'Test', 'Mumbai', 'Engineering', '');
            // The line below should not be reached if an exception is thrown
            System.assert(false, 'Expected exception but got none.');
        } catch (JobSearchController.JobSearchException e) {
            System.assertEquals('Job Type is required', e.getMessage(), 'Unexpected error message for blank jobType');
        }
    }

    // Add more test methods to cover different scenarios (e.g., invalid parameters, exceptions, etc.)
}