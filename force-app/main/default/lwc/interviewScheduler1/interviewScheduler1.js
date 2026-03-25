import { LightningElement, api, wire, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/fullcalendarv3';
import fetchAllEvents from '@salesforce/apex/InterviewController.getEvents';
import createEvent from '@salesforce/apex/InterviewController.createEvent';
import { refreshApex } from '@salesforce/apex';

// Define the component class
export default class InterviewScheduler1 extends LightningElement {
    // Declare the public properties
    fullCalendarJsInitialised = false;
    @track allEvents = [];
    @track selectedEvent = undefined;
    createRecord = false;

    renderedCallback() {

        // Performs this operation only on first render
        if (this.fullCalendarJsInitialised) {
          return;
        }
        this.fullCalendarJsInitialised = true;
    
        // Executes all loadScript and loadStyle promises
        // and only resolves them once all promises are done
        Promise.all([
        //   loadScript(this, FullCalendarJS + '/jquery.min.js'),
        //   loadScript(this, FullCalendarJS + '/moment.min.js'),
        //   loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
        //   loadStyle(this, FullCalendarJS + '/fullcalendar.min.css')
          loadScript(this, FullCalendarJS + '/FullCalenderV3/jquery.min.js'),
          loadScript(this, FullCalendarJS + '/FullCalenderV3/moment.min.js'),
          loadScript(this, FullCalendarJS + '/FullCalenderV3/fullcalendar.min.js'),
          loadStyle(this, FullCalendarJS + '/FullCalenderV3/fullcalendar.min.css')
        ])
        .then(() => {
          // Initialise the calendar configuration
          this.getAllEvents();
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error({
            message: 'Error occured on FullCalendarJS',
            error
          });
        })
    }

    initialiseFullCalendarJs() {
        const ele = this.template.querySelector('div.fullcalendarjs');
        // eslint-disable-next-line no-undef
        $(ele).fullCalendar({
          header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,basicWeek,basicDay,listWeek'
          },
          themeSystem : 'standard',
          defaultDate: new Date(), 
          navLinks: true,
          editable: true,
          eventLimit: true,
          events: this.allEvents,
          dragScroll : true,
          droppable: true,
          weekNumbers : true,
          eventDrop: this.eventDropHandler.bind(this),
          eventClick: this.eventClickHandler.bind(this),
          dayClick : this.dayClickHandler.bind(this),
          eventMouseover : this.eventMouseoverHandler.bind(this)
        //   eventDrop: function(event, delta, revertFunc) {
        //     // alert(event.title + " was dropped on " + event.start.format());
        //     if (!confirm("Are you sure about this change? ")) {
        //       revertFunc();
        //     }
        //   },
        //   eventClick: function(event, jsEvent, view) {
        //     // alert('Event Clicked '+event.title)
        //     this.selectedEvent =  event;
        //     console.log('Selected Event '+this.selectedEvent);
        //   },
        //   dayClick :function(date, jsEvent, view) {
        //     jsEvent.preventDefault();
            
        //   },
        //   eventMouseover : function(event, jsEvent, view) {
        //   }
        });
      }

      eventMouseoverHandler = (event, jsEvent, view)=>{

      }
      eventDropHandler = (event, delta, revertFunc)=>{
        // alert(event.title + " was dropped on " + event.start.format());
        if (!confirm("Are you sure about this change? ")) {
          revertFunc();
        }
      }
    
      eventClickHandler = (event, jsEvent, view) => {
          this.selectedEvent =  event;
          console.log('Selected Event '+event + this.selectedEvent);
      }
    
      dayClickHandler = (date, jsEvent, view)=>{
        jsEvent.preventDefault();
        this.createRecord = true;
      }
    
      createCancel() {
        this.createRecord = false;
      }

      getAllEvents(){
        fetchAllEvents()
        .then(result => {
          this.allEvents = result.map(item => {
            return {
              id : item.Id,
              editable : true,
              title : item.Name,
              start : item.Start_Time__c,
              end : item.End_Time__c,
              company: item.Company__c,
              backgroundColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")",
              borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
            };
          });
          console.log('Interviews '+JSON.stringify(this.allEvents));
          // Initialise the calendar configuration
          this.initialiseFullCalendarJs();
        })
        .catch(error => {
          window.console.log(' Error Occured ', error)
        })
        .finally(()=>{
          //this.initialiseFullCalendarJs();
        })
    }
  
    closeModal(){
      this.selectedEvent = undefined;
    }
}