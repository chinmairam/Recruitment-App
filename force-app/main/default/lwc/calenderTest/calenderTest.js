import { LightningElement,track,wire } from 'lwc';
import getEvents from '@salesforce/apex/InterviewController.getEvents';

export default class CalenderTest extends LightningElement {
  @track startDate=new Date();
  @track endDate;
  error;
  openModal = false;
  @track events=[];
  
  @wire(getEvents)
  eventObj({data, error}){
    // const {data, error} = value;
    if(data){
        console.log('Data '+JSON.stringify(data));
        //format as fullcalendar event object
        let records = data.map(event => {
            return { Id : event.Id,
                    title : event.Name, 
                    start : event.Start_Time__c,
                    end : event.End_Time__c
                    };
        });
        console.log('Records '+JSON.stringify(records));
        this.events = JSON.parse(JSON.stringify(records));
        console.log('Events '+this.events);
        this.error = undefined;
    }else if(error){
        this.events = [];
        this.error = 'No events are found';
    }
   }
   
    handleEvent(event) {
      var id=event.detail;
      let task = this.events.find(x => x.Id=id);
      console.log('Task '+task);
      this.startDate=task.start;
      this.title=task.title;
      this.endDate=task.end;
      this.openModal = true;
      
    }
    handleCancel(event) {
      this.openModal = false;
    }
}