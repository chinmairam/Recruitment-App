import { LightningElement, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord, updateRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from '@salesforce/apex';
import getJobPostings from "@salesforce/apex/JobPostingController.getJobPostings";
import JOB_POSTING_OBJECT from "@salesforce/schema/Job_Posting__c";
import TITLE_FIELD from "@salesforce/schema/Job_Posting__c.Name";
import DEPARTMENT_FIELD from "@salesforce/schema/Job_Posting__c.Department__c";
import LOCATION_FIELD from "@salesforce/schema/Job_Posting__c.Location__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Job_Posting__c.Job_Description__c";
import DEADLINE_FIELD from "@salesforce/schema/Job_Posting__c.Application_Deadline__c";
import STATUS_FIELD from "@salesforce/schema/Job_Posting__c.Status__c";
import CONTACT_FIELD from "@salesforce/schema/Job_Posting__c.Contact__c";

const columns = [
  {
    label: "Job Title",
    fieldName: "Name",
    type: "text",
    sortable: true,
  },
  {
    label: "Department",
    fieldName: "Department__c",
    type: "text",
    sortable: true,
  },
  {
    label: "Location",
    fieldName: "Location__c",
    type: "text",
    sortable: true,
  },
  {
    label: "Job Description",
    fieldName: "Job_Description__c",
    type: "text",
    sortable: true,
  },
  {
    label: "Application Deadline",
    fieldName: "Application_Deadline__c",
    type: "date",
    sortable: true,
  },
  {
    label: "Status Change",
    fieldName: 'Status_Change__c',
    type: "text"
  },
  {
    type: "action",
    typeAttributes: {
      rowActions: [
        { label: "View", name: "view" },
        { label: "Edit", name: "edit" },
        { label: "Delete", name: "delete" },
      ],
    },
  },
];

export default class JobPostings extends NavigationMixin(LightningElement) {
  @track jobPostings;
  @track error;
  @track columns = columns;
  @track isModalOpen = false; // store the state of the modal popup
  @track modalTitle; // store the title of the modal popup
  @track modalContent; // store the content of the modal popup
  @track recordId; // store the id of the selected record
  @track isEditRecord = false;
  @track isCreateRecord = false;
  @track recordIdToEdit;
  @track recordToView;
  @track wiredJobs;
  @track isLoading = false;
  objectApiName = JOB_POSTING_OBJECT;
  fields = [TITLE_FIELD, DEPARTMENT_FIELD, LOCATION_FIELD,
    DESCRIPTION_FIELD, DEADLINE_FIELD, STATUS_FIELD, CONTACT_FIELD]

  @wire(getJobPostings)
  wiredJobPostings(result) {
    this.wiredJobs = result;
    // let updatePromises = [];
    console.log('Wired Jobs '+JSON.stringify(this.wiredJobs));
    if(result.data) {
      this.jobPostings = result.data;
      // this.error = undefined;
      console.log('Table Data '+JSON.stringify(this.jobPostings));
      // check the application deadline and update the status for each record
    } else if (result.error) {
        this.error = result.error;
        console.log('Wire Error '+JSON.stringify(result.error));
        this.jobPostings = undefined;
    }
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "view":
        this.viewRecord(row.Id);
        break;
      case "edit":
        this.editRecord(row.Id);
        break;
      case "delete":
        this.deleteRecord(row.Id);
        break;
      default:
    }
  }

  viewRecord(row) {
    // open a modal popup to show the record details
    this.modalTitle = "View Record";
    this.isModalOpen = true;
    this.recordToView = row;
  }

  editRecord(row) {
    // open a modal popup to edit the record details
    // set the modal title and content
    this.modalTitle = "Edit Record";
    // show the modal popup
    this.isModalOpen = true;
    this.isEditRecord = true;
    this.recordIdToEdit=row;
    let today = new Date();
        // get the application deadline
        let deadline = new Date(row.Application_Deadline__c);
        // compare the dates
        if (today > deadline) {
          // update the status to closed
          const fields = {};
          fields.Id = row.Id;
          fields.Status__c = "Closed";
          const recordInput = { fields };
          updateRecord(recordInput)
            .then(() => {
              console.log("Record updated");
              this.jobPostings = this.jobPostings.filter(newrecord => newrecord.Status__c !== 'Closed');
              refreshApex(this.wiredJobs);
            })
            .catch((error) => {
              console.error('Update Error '+error);
            });
            
        }
      // filter out records with status 'Closed'
      // this.jobPostings = this.jobPostings.filter(newrecord => newrecord.Status__c !== 'Closed');
      // refreshApex(this.wiredJobs);
  }

  deleteRecord(row) {
    // show a confirmation prompt before deleting the record
    if (confirm("Are you sure you want to delete this record?")) {
      deleteRecord(row)
        .then(() => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Record deleted",
              variant: "success",
            })
          );
          // refresh the datatable after deletion
          this.refreshJobs();
        })
        .catch((error) => {
          console.log('Error '+error.body.message);
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error deleting record",
              message: error.body.message,
              variant: "error",
            })
          );
        });
    }
  }

  handleCreate() {
    // navigate to a new record page to create a job posting
    this.isModalOpen = true;
    this.isCreateRecord = true;
    // const pageReference = {
    //     type: "standard__objectPage",
    //     attributes: {
    //         objectApiName: "Job_Posting__c",
    //         actionName: "new",
    //     },
    // }
    // this[NavigationMixin.Navigate](pageReference)
    // // console.log('Before Refresh');
    // this.refreshJobs();
    // console.log('After Refresh');
  }
  
  handleSubmit(){
    console.log('In Edit Submit');
    this.isModalOpen = false;
    // this.isEditRecord = false;
    const evt = new ShowToastEvent({
        title: 'Success Message',
        message: 'Record Updated successfully ',
        variant: 'success',
        mode:'dismissible'
    });
    this.dispatchEvent(evt);
    this.refreshJobs();
  }

  refreshJobs(){
    console.log('In Refresh Jobs');
    this.isLoading = true;
    refreshApex(this.wiredJobs).then(result => {
      console.log('Result '+result);
      this.isLoading = false;
    }).catch(error => {
      console.log('Error '+error);
    });
  }

  handleSuccess(){
    console.log('In Create Success');
    this.isModalOpen = false;
    // this.isCreateRecord = false;
    const evt = new ShowToastEvent({
      title: 'Success!!',
      message: 'Record Created successfully ',
      variant: 'success',
      mode:'dismissible'
      });
      this.dispatchEvent(evt);
      this.refreshJobs();
  }

  closeModal() {
    // close the modal popup
    this.isModalOpen = false;
    this.isEditRecord = false;
    this.isCreateRecord = false;
  }
}
