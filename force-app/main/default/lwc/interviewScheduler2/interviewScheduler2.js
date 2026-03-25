import { LightningElement, api, wire, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/fullcalendarv3';
import fetchEvents from '@salesforce/apex/InterviewController.getEvents';
import createEvent from '@salesforce/apex/InterviewController.createEvent';
import deleteEvent from '@salesforce/apex/InterviewController.deleteEvent';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InterviewScheduler2 extends LightningElement {
    fullCalendarJsInitialised = false;

    //Fields to store the event data -- add all other fields you want to add
    title;
    startDate;
    endDate;
    company;

    eventsRendered = false;//To render initial events only once
    openSpinner = false; //To open the spinner in waiting screens
    openModal = false; //To open form

    @track events = []; //all calendar events are stored in this field

    //To store the orignal wire object to use in refreshApex method
    eventOriginalData = [];

    calendarLoaded = false;
    // renderCalendar() {
    // if(!this.calendarLoaded || !this.events) {
    //     return;
    // }
    // this.initialiseFullCalendarJs();
    // }

   /**
    * Load the fullcalendar.io in this lifecycle hook method
    */
   renderedCallback() {
      // Performs this operation only on first render
      if (this.fullCalendarJsInitialised) {
         return;
      }
      this.fullCalendarJsInitialised = true;

      // Executes all loadScript and loadStyle promises
      // and only resolves them once all promises are done
        Promise.all([
            loadScript(this, FullCalendarJS + '/FullCalenderV3/jquery.min.js'),
            loadScript(this, FullCalendarJS + '/FullCalenderV3/moment.min.js'),
            loadScript(this, FullCalendarJS + '/FullCalenderV3/fullcalendar.min.js'),
            loadStyle(this, FullCalendarJS + '/FullCalenderV3/fullcalendar.min.css')
        ])
        .then(() => {
            this.getAllEvents();
        })
        .catch((error) => {
        console.error({
            message: "Error occured on FullCalendarJS",
            error,
        });
        });
    }

    initialiseFullCalendarJs() {
        const ele = this.template.querySelector('div.fullcalendarjs');
        const modal = this.template.querySelector('div.modalclass');

        function openActivityForm(startDate, endDate){
                self.startDate = startDate;
                self.endDate = endDate;
                self.openModal = true;
        }
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
          events: this.events,
          dragScroll : true,
          droppable: true,
          weekNumbers : true,
          select: function (startDate, endDate) {
                    let stDate = startDate.format();
                    let edDate = endDate.format();
                    
                    openActivityForm(stDate, edDate);
            },
          eventDrop: function(event, delta, revertFunc) {
            // alert(event.title + " was dropped on " + event.start.format());
            if (!confirm("Are you sure about this change? ")) {
              revertFunc();
            }
          },
          eventClick: function(event, jsEvent, view) {
            this.selectedEvent =  event;
            console.log('Selected Event '+this.selectedEvent);
          },
          dayClick :function(date, jsEvent, view) {
            jsEvent.preventDefault();
            
          },
          eventMouseover : function(event, jsEvent, view) {
          }
        });
    }

    getAllEvents(){
        fetchEvents()
        .then(result => {
          this.events = result.map(item => {
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
          // console.log('Interviews '+JSON.stringify(this.events));
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

    handleKeyup(event) {
        this.title = event.target.value;
    }

    handleCompanyKey(event){
      this.company = event.target.value;
    }
    
    //To close the modal form
    handleCancel(event) {
        this.openModal = false;
    }

   //To save the event
    handleSave(event) {
        let events = this.events;
        this.openSpinner = true;

        //get all the field values
        this.template.querySelectorAll('lightning-input').forEach(ele => {
            if(ele.name === 'title'){
               this.title = ele.value;
           }
           if(ele.name === 'start'){
                this.startDate = ele.value.includes('.000Z') ? ele.value : ele.value + '.000Z';
            }
            if(ele.name === 'end'){
                this.endDate = ele.value.includes('.000Z') ? ele.value : ele.value + '.000Z';
            }
            if(ele.name === 'company'){
              this.company = ele.value;
            }
        });
       
        //format as per fullcalendar event object to create and render
        let newevent = {
          title : this.title, 
          start : this.startDate, 
          end: this.endDate, 
          company: this.company
        };
        console.log(this.events);

        //Close the modal
        this.openModal = false;
        //Server call to create the event
        createEvent({'event' : JSON.stringify(newevent)})
        .then( result => {
            const ele = this.template.querySelector("div.fullcalendarjs");

            //To populate the event on fullcalendar object
            //Id should be unique and useful to remove the event from UI - calendar
            newevent.id = result;
            
            //renderEvent is a fullcalendar method to add the event to calendar on UI
            //Documentation: https://fullcalendar.io/docs/v3/renderEvent
            $(ele).fullCalendar( 'renderEvent', newevent, true );
            
            //To display on UI with id from server
            this.events.push(newevent);

            //To close spinner and modal
            this.openSpinner = false;

            //show toast message
            this.showNotification('Success!!', 'Your event has been logged', 'success');

        })
        .catch( error => {
            console.log(error);
            this.openSpinner = false;

            //show toast message - TODO 
            this.showNotification('Oops', 'Something went wrong, please review console', 'error');
        })
   }

   removeEvent(event) {
    //open the spinner
    this.openSpinner = true;

    //delete the event from server and then remove from UI
    let eventid = event.target.value;
    deleteEvent({'eventid' : eventid})
    .then( result => {
        console.log(result);
        const ele = this.template.querySelector("div.fullcalendarjs");
        console.log(eventid);
        $(ele).fullCalendar( 'removeEvents', [eventid] );

        this.openSpinner = false;
        
        //refresh the grid
        return refreshApex(this.eventOriginalData);

    })
    .catch( error => {
        console.log(error);
        this.openSpinner = false;
    });
}

   addEvent(event) {
    this.startDate = null;
    this.endDate = null;
    this.title = null;
    this.company=null;
    this.openModal = true;
}

/**
 * @description method to show toast events
 */
showNotification(title, message, variant) {
    console.log('enter');
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(evt);
}
}