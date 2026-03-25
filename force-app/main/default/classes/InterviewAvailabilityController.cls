public with sharing class InterviewAvailabilityController {
    // custom object and fields for availability
    public static final String OBJECT_NAME = 'Interview_Availability__c';
    public static final String NAME_FIELD = 'Name';
    public static final String START_TIME_FIELD = 'Start_Time__c';
    public static final String END_TIME_FIELD = 'End_Time__c';
    public static final String STATUS_FIELD = 'Status__c';
  
    // get the availability records for the current user
    @AuraEnabled(cacheable=true)
    public static List<SObject> getAvailability() {
      return [
        SELECT Id, Name, Start_Time__c, End_Time__c, Status__c
        FROM Interview_Availability__c
        WHERE OwnerId = :UserInfo.getUserId()
        ORDER BY Start_Time__c
      ];
    }
  
    // save or update an availability record
    @AuraEnabled
    public static Id saveAvailability(SObject availability) {
      // set the owner id to the current user
      availability.put('OwnerId', UserInfo.getUserId());
      // upsert the record
      upsert availability;
      // return the record id
      return availability.Id;
    }
  
    // delete an availability record by id
    @AuraEnabled
    public static void deleteAvailability(Id availabilityId) {
      // delete the record
      delete new Interview_Availability__c(Id=availabilityId);
    }
}
