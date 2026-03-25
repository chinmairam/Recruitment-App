public with sharing class JobPostingController {
    @AuraEnabled(cacheable=true)
    public static List<Job_Posting__c> getJobPostings() {
      Id userId = UserInfo.getUserId();
      return [SELECT Id, Name, Department__c, Location__c, Job_Description__c, Application_Deadline__c, Status__c, Status_Change__c FROM Job_Posting__c WHERE CreatedById = :userId AND Status__c != 'Closed' AND Application_Deadline__c > TODAY];
    }
}
