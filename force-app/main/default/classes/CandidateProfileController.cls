public with sharing class CandidateProfileController {
    // Define a method that takes a record id as a parameter and returns the verification status as a string
    @AuraEnabled(cacheable=true)
    public static String getVerificationStatus(Id recordId) {
      // Query the verification status field from the CandidateProfile__c object
      CandidateProfile__c cp = [SELECT Verification_Status__c FROM CandidateProfile__c WHERE Id = :recordId];
      // Return the verification status value
      return cp.Verification_Status__c;
    }
  }
