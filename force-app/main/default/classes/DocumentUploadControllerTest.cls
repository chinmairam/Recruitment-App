@isTest
public class DocumentUploadControllerTest {
  @isTest static void testFileUpload() {
    // Create a test CandidateProfile record
    CandidateProfile__c cp = new CandidateProfile__c(
        Name = 'Test',
        Email__c='pspk@gmail.com',
        Address__c = 'India',
        MobileNo__c = '9387488484');
    insert cp;
    // Create a test ContentVersion record
    ContentVersion cv = new ContentVersion(
      Title = 'Test',
      PathOnClient = 'Test.jpg',
      VersionData = Blob.valueOf('Test Content'),
      IsMajorVersion = true
    );
    insert cv;
    // Create a test ContentDocumentLink record
    ContentDocumentLink cdl = new ContentDocumentLink(
      ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id].ContentDocumentId,
      LinkedEntityId = cp.Id,
      ShareType = 'V'
    );
    insert cdl;
    // Query the updated CandidateProfile record
    cp = [SELECT Id, FileUploaded__c, Verification_Status__c FROM CandidateProfile__c WHERE Id = :cp.Id];
    // Assert that the FileUploaded__c field is incremented and the Verification_Status__c field is cleared
    System.assertEquals(1, cp.FileUploaded__c, 'FileUploaded__c should be 1');
    System.assertEquals('Pending', cp.Verification_Status__c, 'Verification_Status__c should be Pending');

    ProcessInstance pi = [SELECT Id, Status FROM ProcessInstance WHERE TargetObjectId = :cp.Id];
    // Assert that the record is submitted for approval
    System.assertEquals('Pending', pi.Status, 'Approval status should be Pending');
  }
}