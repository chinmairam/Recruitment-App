public with sharing class InterviewController {
    @AuraEnabled
    public static List<Interview_Availability__c> getEvents() {
        List<Interview_Availability__c> interviewList = [
            SELECT Id, Name, Start_Time__c, End_Time__c, Company__c 
            FROM Interview_Availability__c 
            ORDER BY CreatedDate DESC
            LIMIT 100];
        for(Interview_Availability__c meet: interviewList) {
            meet.End_Time__c = DateTime.valueOfGMT(String.valueOf(meet.End_Time__c));
            meet.Start_Time__c = DateTime.valueOfGMT(String.valueOf(meet.Start_Time__c));
        }
        return interviewList;
    }

    @AuraEnabled
    public static Id createEvent(String event){

        //The following logic to be replaced with your respective event object
        if(String.isBlank(event)){
            return null;
        }
        Map<String, Object> eventMap = (Map<String, Object>) JSON.deserializeUntyped(event);
        
        Interview_Availability__c newEvent = new Interview_Availability__c();
        newEvent.Name = eventMap.get('title') != null ? (String)eventMap.get('title') : null;

        String startdate = eventMap.get('start') != null ? 
                            ((String)eventMap.get('start')).replace('T', ' ').replace('.000Z', '') : 
                            null;
        String endDate = eventMap.get('end') != null ? 
                            ((String)eventMap.get('end')).replace('T', ' ').replace('.000Z', '') : 
                            null;

        newEvent.Start_Time__c = startdate != null ? Datetime.valueOfGmt(startdate) : null;
        newEvent.End_Time__c = endDate != null ? Datetime.valueOfGmt(endDate) : null;
        newEvent.Company__c = eventMap.get('company') != null ? (String)eventMap.get('company') : null;
        List<Interview_Availability__c> eventsToInsert = new List<Interview_Availability__c>();
        eventsToInsert.add(newEvent);
        insert eventsToInsert;
        // insert newEvent;

        return newEvent.Id;
    }

    @AuraEnabled
    public static void deleteEvent(Id eventid) {
        if(eventid != null){
            delete [SELECT Id FROM Interview_Availability__c Where Id=:eventid];
        }else{
            throw new InterviewAvailabilityException('Event id is not passed');
        }
    }

    public class InterviewAvailabilityException extends Exception {}
}
