@RestResource(urlMapping = '/jobsearch/')
global with sharing class JobSearchController {
    @AuraEnabled(cacheable=true)
    @HttpGet
    global static List<JobListing__c> getJobListings() {
        // get the query parameters from the request
        RestRequest req = RestContext.request;
        String location = req.params.get('location');
        String industry = req.params.get('industry');
        String jobType = req.params.get('jobType');

        String query = 'SELECT Id, Company__c, Title__c, Location__c, Industry__c, Job_Type__c FROM JobListing__c';
        if (String.isNotBlank(location)) {
            query += ' WHERE Location__c = \'' + String.escapeSingleQuotes(location) + '\'';
        }
        if (String.isNotBlank(industry)) {
            query += (query.contains('WHERE') ? ' AND' : ' WHERE') + ' Industry__c = \'' + String.escapeSingleQuotes(industry) + '\'';
        }
        if (String.isNotBlank(jobType)) {
            query += (query.contains('WHERE') ? ' AND' : ' WHERE') + ' Job_Type__c = \'' + String.escapeSingleQuotes(jobType) + '\'';
        }

        String newquery = query;

        // Execute the query and return the results
        try{
            return Database.query(newquery);
        }
        catch(Exception e){
            System.debug('Error '+e.getMessage());
            return null;
        }
    }

    // add an @HttpPost method to create a new job listing
    @AuraEnabled(cacheable=true)
    @HttpPost
    global static JobListing__c createJobListing(String company, String title, String location, String industry, String jobType) {
        // validate the input parameters
        if (String.isBlank(company)) {
            throw new JobSearchException('Company is required');
        }
        if (String.isBlank(title)) {
            throw new JobSearchException('Title is required');
        }
        if (String.isBlank(location)) {
            throw new JobSearchException('Location is required');
        }
        if (String.isBlank(industry)) {
            throw new JobSearchException('Industry is required');
        }
        if (String.isBlank(jobType)) {
            throw new JobSearchException('Job Type is required');
        }

        // create a new job listing record
        JobListing__c newJob = new JobListing__c(
            Company__c = company,
            Title__c = title,
            Location__c = location,
            Industry__c = industry,
            Job_Type__c = jobType
        );

        // insert the record and return it
        insert newJob;
        return newJob;
    }

    // define a custom exception class for job search errors
    global class JobSearchException extends Exception {}
}