import { LightningElement, api, wire } from 'lwc';
//importing the Chart library from Static resources
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CANDIDATE_PROFILE_OBJECT from '@salesforce/schema/CandidateProfile__c';
import getVerificationStatus from '@salesforce/apex/CandidateProfileController.getVerificationStatus';
import VERIFICATION_STATUS_FIELD from '@salesforce/schema/CandidateProfile__c.Verification_Status__c';
import Id from '@salesforce/user/Id';
import getCandidateId from '@salesforce/apex/setRecordId.getCandidateId';

export default class VerificationStatusComp extends LightningElement {
  @api recordId; // The record id of the CandidateProfile__c object
  @api objectApiName; // The object api name of the CandidateProfile__c object
  verificationStatus; // The value of the Verification_Status__c field
  verificationStatusOptions; // The picklist options for the Verification_Status__c field
  chart; // The chart instance
  chartjsInitialized = false; // The flag to indicate if the chart is initialized
  config = {
    // The chart configuration
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [1], // The initial data
          backgroundColor: ['rgb(255, 205, 86)'], // The initial color
          label: 'Dataset 1',
        },
      ],
      labels: ['Pending'], // The initial label
    },
    options: {
      // The chart options
      responsive: true,
      legend: {
        position: 'right',
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  };

   @wire(getCandidateId, {
        userId: Id
    })
    wiredCandidate({data,error}){
        if(data){
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.recordId = JSON.parse(JSON.stringify(data))
        }
        if(error){
            this.error = error
        }
    }

  @wire(getObjectInfo, {objectApiName: CANDIDATE_PROFILE_OBJECT})
  candidateInfo

  // Fetch the picklist values from the schema
  @wire(getPicklistValues, {
    recordTypeId: '$candidateInfo.data.defaultRecordTypeId', // The default record type id
    fieldApiName: VERIFICATION_STATUS_FIELD, // The field api name
  })
  getPicklistValuesForField({ data, error }) {
    if (error) {
      // TODO: Error handling
      console.error(error);
    } else if (data) {
      this.verificationStatusOptions = [...data.values];
    }
  }

  // Fetch the verification status from the apex method
  @wire(getVerificationStatus, { recordId: '$recordId' })
  getVerificationStatusFromApex({ data, error }) {
    if (error) {
      // TODO: Error handling
      console.error(error);
    } else if (data) {
      this.verificationStatus = data;
      console.log('Verify Status '+this.verificationStatus);
      this.updateChart(); // Update the chart with the new value
    }
  }

  renderedCallback() {
    if (this.chartjsInitialized) {
      return;
    }
    this.chartjsInitialized = true;
    Promise.all([loadScript(this, chartjs)])
      .then(() => {
        // Load the chart library
        const ctx = this.template
          .querySelector('canvas.donut')
          .getContext('2d'); // Get the canvas context
        this.chart = new window.Chart(ctx, this.config); // Create the chart instance
      })
      .catch((error) => {
        // Handle the error
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error loading ChartJS',
            message: error.message,
            variant: 'error',
          })
        );
      });
  }

  updateChart() {
    // Update the chart with the new value
    this.chart.data.labels = [this.verificationStatus]; // Set the label to the verification status
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data = [1]; // Set the data to 1
      dataset.backgroundColor = this.getColor(); // Set the color based on the verification status
    });
    this.chart.update(); // Update the chart
  }

  getColor() {
    // Get the color based on the verification status
    let color = 'rgb(255, 205, 86)'; // Default color for Pending
    if (this.verificationStatus === 'Approved') {
      color = 'rgb(75, 192, 192)'; // Green color for Approved
    } else if (this.verificationStatus === 'Rejected') {
      color = 'rgb(255, 99, 132)'; // Red color for Rejected
    }
    return color;
  }
}

