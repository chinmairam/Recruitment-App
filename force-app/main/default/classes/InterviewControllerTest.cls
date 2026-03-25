@isTest
private class InterviewControllerTest {

    // A helper method to create a test event
    private static Interview_Availability__c createTestEvent(
        String name,
        Datetime start, 
        Datetime end1, 
        String company
    ) {
        Interview_Availability__c event = new Interview_Availability__c();
        event.Name = name;
        event.Start_Time__c = start;
        event.End_Time__c = end1;
        event.Company__c = company;
        return event;
    }

    // A test method to test the getEvents method
    @isTest
    static void testGetEvents() {
        // Create some test events
        List<Interview_Availability__c> events = new List<Interview_Availability__c>();
        events.add(createTestEvent('Event 1', Datetime.newInstance(2024, 1, 20, 10, 0, 0), Datetime.newInstance(2024, 1, 20, 11, 0, 0), 'IBM'));
        events.add(createTestEvent('Event 2', Datetime.newInstance(2024, 1, 21, 12, 0, 0), Datetime.newInstance(2024, 1, 21, 13, 0, 0), 'IBM'));
        events.add(createTestEvent('Event 3', Datetime.newInstance(2024, 1, 22, 14, 0, 0), Datetime.newInstance(2024, 1, 22, 15, 0, 0), 'IBM'));
        insert events;

        // Call the getEvents method
        List<Interview_Availability__c> result = InterviewController.getEvents();

        // Verify the result
        System.assertEquals(3, result.size(), 'The result size should be 3');
    }

    // A test method to test the createEvent method
    @isTest
    static void testCreateEvent() {
        // Create a test event as a JSON string
        String event = '{"title":"Test Event","start":"2024-01-23T16:00:00.000Z","end":"2024-01-23T17:00:00.000Z","company":"IBM"}';

        // Call the createEvent method
        Id eventId = InterviewController.createEvent(event);

        // Verify the result
        System.assertNotEquals(null, eventId, 'The event id should not be null');
        Interview_Availability__c createdEvent = [SELECT Id, Name, Start_Time__c, End_Time__c, Company__c FROM Interview_Availability__c WHERE Id = :eventId];
        System.assertEquals('Test Event', createdEvent.Name, 'The event name should be Test Event');
        System.assertEquals(DateTime.valueOfGMT(String.valueOf(Datetime.newInstance(2024, 1, 23, 16, 0, 0))), createdEvent.Start_Time__c, 'The event start time should match');
        System.assertEquals(DateTime.valueOfGMT(String.valueOf(Datetime.newInstance(2024, 1, 23, 17, 0, 0))), createdEvent.End_Time__c, 'The event end time should match');
        System.assertEquals('IBM', createdEvent.Company__c, 'The company name should be IBM');
    }

    // A test method to test the deleteEvent method
    @isTest
    static void testDeleteEvent() {
        // Create a test event
        Interview_Availability__c event = createTestEvent('Delete Event', Datetime.newInstance(2024, 1, 24, 18, 0, 0), Datetime.newInstance(2024, 1, 24, 19, 0, 0), 'IBM');
        insert event;

        // Call the deleteEvent method
        Test.startTest();
        InterviewController.deleteEvent(event.Id);
        Test.stopTest();

        // Verify the result
        List<Interview_Availability__c> deletedEvents = [SELECT Id FROM Interview_Availability__c WHERE Id = :event.Id];
        System.assertEquals(0, deletedEvents.size(), 'The event should be deleted');
    }

    // A test method to test the deleteEvent method with a null id
    @isTest
    static void testDeleteEventWithNullId() {
        // Call the deleteEvent method with a null id
        Test.startTest();
        try {
            InterviewController.deleteEvent(null);
            System.assert(false, 'The deleteEvent method should throw an exception');
        } catch (InterviewController.InterviewAvailabilityException e) {
            System.assertEquals('Event id is not passed', e.getMessage(), 'The exception message should be Event id is not passed');
        }
        Test.stopTest();
    }
}