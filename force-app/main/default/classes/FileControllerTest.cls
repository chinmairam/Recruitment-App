@isTest
public class FileControllerTest {
    @isTest
    static void testGetVersionFiles() {
        // Test data setup
        CandidateProfile__c cand = new CandidateProfile__c(
            Name='PSPK',
            Email__c='pspk@gmail.com',
            Address__c = 'India',
            MobileNo__c = '9387488484'
        );
        insert cand;
        
        ContentVersion cv = new ContentVersion(
            Title = 'Test File',
            FirstPublishLocationId = cand.Id,
            VersionData=Blob.valueOf('Test Data'),
            PathOnClient = 'TestFile.jpg'
        );
        insert cv;
        
        System.debug('CV: '+cv);
        Test.startTest();
        List<ContentVersion> result = FileController.getVersionFiles(cv.FirstPublishLocationId);
        Test.stopTest();
        System.debug(result);
        // Verify the results
        System.assertEquals(1, result.size(), 'There should be one ContentVersion record in the result');
        System.assertEquals(cv.Id, result[0].Id, 'ContentVersion Id should match');
        System.assertEquals(cv.Title, result[0].Title,  'Title should match');
        //System.assertEquals(cv.ContentDocumentId, result[0].ContentDocumentId, 'ContentDocumentId should match');
        //System.assertEquals(cv.ContentSize, result[0].ContentSize);
        //System.assertEquals(cv.FileExtension, result[0].FileExtension);
        //System.assertEquals(cv.VersionNumber, result[0].VersionNumber);
        //System.assertEquals(cv.CreatedDate, result[0].CreatedDate);
        //System.assertEquals(cv.VersionData, result[0].VersionData);
        //System.assertEquals(cv.FirstPublishLocationId, result[0].FirstPublishLocationId);
    }
    
    @isTest
    static void testGetVersionFilesNegative() {
        // Test Case 2: Negative case - Record not found
        Test.startTest();
        List<ContentVersion> emptyResult = FileController.getVersionFiles('a0V5h00000ABaAFEA3');
        Test.stopTest();
        
        // Verify that no records are returned
        System.assertEquals(0, emptyResult.size(), 'No ContentVersion record should be returned');
    }
    
    @isTest
    static void testGetVersionFilesException() {
        // Test Case 3: Exception handling
        Test.startTest();
        try {
            FileController.getVersionFiles('');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e.getMessage(), 'Exception should be thrown');
        }
        Test.stopTest();
    }
}