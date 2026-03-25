public with sharing class ProfileDataLwcController {
   @AuraEnabled(cacheable=true)
   public static CandidateProfile__c getFieldsFromCand(String candidateId){
      CandidateProfile__c candidateRecord = [SELECT Id, Name, Date_of_Birth__c, Education__c, Email__c, Gender__c, 
      MobileNo__c,Skills__c,Work_Experience__c,Address__c FROM CandidateProfile__c where Id =: candidateId];
      System.debug('Candidate '+candidateRecord);
      return candidateRecord;
   }

   @AuraEnabled(cacheable=true)
    public static List<String> getFormFields() {
        // Implement logic to retrieve form fields dynamically
        List<String> fields = new List<String>{'Id', 'Name', 'Date_of_Birth__c', 'Education__c', 
            'Email__c', 'Gender__c', 'MobileNo__c','Skills__c','Work_Experience__c'};
        return fields;
    }

   /*@AuraEnabled
    public static Id saveFormData(Map<String, Object> formData, Id recordId) {
        CandidateProfile__c record;

        if (recordId != null) {
            record = [SELECT Id FROM CandidateProfile__c WHERE Id = :recordId LIMIT 1];
        } else {
            record = new CandidateProfile__c();
        }

        
        //record.addAll(formData.values());
        upsert record;

        return record.Id;
    }*/

    //Id, Name, Date_of_Birth__c, Education__c, Email__c, Gender__c, 
    //  MobileNo__c,Skills__c,Work_Experience__c
    @AuraEnabled
    public static Map<String, Object> getFormData(Id recordId) {
        // Implement logic to retrieve form data based on recordId
        CandidateProfile__c record = [SELECT Id, Name, Date_of_Birth__c, Education__c, Email__c, Gender__c, 
        MobileNo__c,Skills__c,Work_Experience__c FROM CandidateProfile__c WHERE Id = :recordId LIMIT 1];
        Map<String, Object> formData = new Map<String, Object>{
            'Id'=> record.Id,
            'Name'=> record.Name,
            'Date_of_Birth__c' => record.Date_of_Birth__c,
            'Education__c'=> record.Education__c,
            'Email__c' => record.Email__c,
            'Gender__c' => record.Gender__c,
            'MobileNo__c' => record.MobileNo__c,
            'Skills__c' => record.Skills__c,
            'Work_Experience__c' => record.Work_Experience__c
            // Add other fields as needed
        };
        return formData;
    }

    @AuraEnabled(cacheable=true)
    public static String saveCandidateFields(String recordId, String CandRecord){
        CandidateProfile__c candidateRecord = (CandidateProfile__c) JSON.deserialize(CandRecord, CandidateProfile__c.class);
        System.debug('candidateRecord Success '+ candidateRecord);
        String message = 'success';
        try{     
            CandidateProfile__c candToBeUpdated = new CandidateProfile__c();
            candToBeUpdated.Name = candidateRecord.Name!=null? candidateRecord.Name:null;
            candToBeUpdated.Date_of_Birth__c = candidateRecord.Date_of_Birth__c!=null? candidateRecord.Date_of_Birth__c:null;
            candToBeUpdated.Email__c = candidateRecord.Email__c!=null? candidateRecord.Email__c:null;
            candToBeUpdated.Gender__c = candidateRecord.Gender__c!=null? candidateRecord.Gender__c:null;
            candToBeUpdated.MobileNo__c = candidateRecord.MobileNo__c!=null? candidateRecord.MobileNo__c:null;
            candToBeUpdated.Address__c = candidateRecord.Address__c!=null? candidateRecord.Address__c:null;

            update candToBeUpdated;
            //Database.update(candToBeUpdated, false);
        }
        catch(Exception ex){
            message =  ex.getMessage();
            System.debug('Error while updating:'+' Exception Message: '+ex.getMessage()+' Exception Line Number: '+ex.getLineNumber()+' ,Candidate Record ID: '+recordId);
        }
        return message;
    }

/*
   @AuraEnabled(cacheable=true)
   public static String saveCandidateFields(String recordId, String candidateRecord){
    CandidateProfile__c candidateRecord = candidateRecord;

    System.debug('candidateRecord Success '+ candidateRecord);
    String message = 'success';
     try{     
         CandidateProfile__c candToBeUpdated = new CandidateProfile__c();
         candToBeUpdated.Name = candidateRecord.Name!=null? candidateRecord.Name:null;
         candToBeUpdated.Date_of_Birth__c = candidateRecord.Date_of_Birth__c!=null? candidateRecord.Date_of_Birth__c:null;
         candToBeUpdated.Education__c = candidateRecord.Education__c!=null? candidateRecord.Education__c:null;
         candToBeUpdated.Email__c = candidateRecord.Email__c!=null? candidateRecord.Email__c:null;
         candToBeUpdated.Gender__c = candidateRecord.Gender__c!=null? candidateRecord.Gender__c:null;
         candToBeUpdated.MobileNo__c = candidateRecord.MobileNo__c!=null? candidateRecord.MobileNo__c:null;
         candToBeUpdated.Skills__c = candidateRecord.Skills__c!=null? candidateRecord.Skills__c:null;
         candToBeUpdated.Work_Experience__c = candidateRecord.Work_Experience__c!=null? candidateRecord.Work_Experience__c:null;

         Database.update(candToBeUpdated, false);
     }
     catch(Exception ex){
        message =  ex.getMessage();
        System.debug('Error while updating:'+' Exception Message: '+ex.getMessage()+' Exception Line Number: '+ex.getLineNumber()+' ,Candidate Record ID: '+recordId);
     }
     return message;
    }*/
}