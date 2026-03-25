import { LightningElement, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord, updateRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from '@salesforce/apex';
import getJobPostings from "@salesforce/apex/JobPostingController.getJobPostings";

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
    label: "Status",
    fieldName: "Status__c",
    type: "text",
    sortable: true,
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

export default class JobPostingNew extends NavigationMixin(LightningElement) {
  @track jobPostings;
  @track error;
  @track columns = columns;
  @track isModalOpen = false; // store the state of the modal popup
  @track modalTitle; // store the title of the modal popup
  @track modalContent; // store the content of the modal popup
  @track recordId; // store the id of the selected record
  @track isEditRecord = false;
  @track recordIdToEdit;
  @track recordToView;
  @track wiredJobs;
  @track isLoading = false;

  @wire(getJobPostings)
  wiredJobPostings(result) {
    this.wiredJobs = result;
    console.log('Wired Jobs '+JSON.stringify(this.wiredJobs));
    if(result.data) {
      this.jobPostings = result.data;
      // this.error = undefined;
      console.log('Table Data '+JSON.stringify(this.jobPostings));
      // check the application deadline and update the status for each record
      this.jobPostings.forEach((record) => {
        // get the current date
        let today = new Date();
        // get the application deadline
        let deadline = new Date(record.Application_Deadline__c);
        // compare the dates
        if (today > deadline) {
          // update the status to closed
          const fields = {};
          fields.Id = record.Id;
          fields.Status__c = "Closed";
          const recordInput = { fields };
          updateRecord(recordInput)
            .then(() => {
              console.log("Record updated");
            })
            .catch((error) => {
              console.error('Update Error '+error);
            });
        }
      });
      // filter out records with status 'Closed'
      this.jobPostings = this.jobPostings.filter(newrecord => newrecord.Status__c !== 'Closed');
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
    // set the modal title and content
    this.modalTitle = "View Record";
    // this.modalContent = JSON.stringify(row, null, 2);
    // show the modal popup
    this.isEditRecord = false;
    this.isModalOpen = true;
    this.recordToView = row;
  }

  editRecord(row) {
    // open a modal popup to edit the record details
    // set the modal title and content
    this.modalTitle = "Edit Record";
    // this.modalContent = JSON.stringify(row, null, 2);
    // show the modal popup
    this.isModalOpen = true;
    this.isEditRecord = true;
    this.recordIdToEdit=row;
  }

  deleteRecord(row) {
    // show a confirmation prompt before deleting the record
    // const { id } = row;
    // console.log('ID '+id);
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
    const pageReference = {
        type: "standard__objectPage",
        attributes: {
            objectApiName: "Job_Posting__c",
            actionName: "new",
        },
    }
    this[NavigationMixin.Navigate](pageReference).then(()=>{
      this.refreshJobs();
    });
  }

  handleSubmit(){
    console.log('In Handle Submit');
    this.isModalOpen = false;
    const evt = new ShowToastEvent({
        title: 'Success Message',
        message: 'Record Updated successfully ',
        variant: 'success',
        mode:'dismissible'
    });
    this.dispatchEvent(evt);
    this.refreshJobs();
  }

  async refreshJobs(){
    console.log('In Refresh Jobs');
    this.isLoading = true;
    await refreshApex(this.wiredJobs).then(result => {
      console.log('Result '+result);
      this.isLoading = false;
    }).catch(error => {
      console.log('Error '+error);
    });
  }

//   handleSuccess(){
//     console.log('Handle Success');
//     this.refreshJobs();
// }

  closeModal() {
    // close the modal popup
    this.isModalOpen = false;
  }
}
