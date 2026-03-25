public with sharing class setRecordId {
    @AuraEnabled(cacheable=true)
    public static Id getRecordId() {
        Id contactId = [SELECT Id,ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1].ContactId;
        System.debug(contactId);
        return contactId;
    }

    @AuraEnabled(cacheable=true)
    public static Id getCandidateId(String userId){
        Id candidateId = [SELECT Id FROM CandidateProfile__c where CreatedById = :userId LIMIT 1].Id;
        return candidateId;
    }
}
