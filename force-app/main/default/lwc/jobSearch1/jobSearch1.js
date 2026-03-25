import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import JOB_LISTING_OBJECT from '@salesforce/schema/JobListing__c';
import INDUSTRY_FIELD from '@salesforce/schema/JobListing__c.Industry__c';
import JOB_TYPE_FIELD from '@salesforce/schema/JobListing__c.Job_Type__c';
import restUrl from '@salesforce/label/c.CORE_REST_URL';
import tokenUrl from '@salesforce/label/c.CORE_TOKEN_URL';
import clientId from '@salesforce/label/c.Job_Client_Id';
import clientSecret from '@salesforce/label/c.Job_Client_Secret';

export default class JobSearch1 extends LightningElement {
    @track jobListings = []; // the list of job listings
    @track error; // the error message
    @track filters = {}; // the filters object
    @track columns = [ // the columns for the data table
        { label: 'Company', fieldName: 'Company__c', type: 'text' },
        { label: 'Job Title', fieldName: 'Title__c', type: 'text' },
        { label: 'Location', fieldName: 'Location__c', type: 'text' },
        { label: 'Industry', fieldName: 'Industry__c', type: 'text' },
        { label: 'Job Type', fieldName: 'Job_Type__c', type: 'text' },
    ];
    industryOptions = []; // the options for the industry picklist
    jobTypeOptions = []; // the options for the job type picklist

    @track title = '';
    @track location = '';
    @track industry = '';
    @track jobType = '';

    handleLocationChange(event){
        this.location = event.target.value;
    }
    handleIndustryChange(event){
        this.industry = event.target.value;
    }
    handleJobTypeChange(event){
        this.jobType = event.target.value;
    }

    handleSearch(){
        this.jobListings = undefined;
        this.error = undefined;
        // Use fetch function to call the Apex RESTful web service
        let url = restUrl; // The base URL of the web service
        let token = tokenUrl;
        let params = new URLSearchParams(); // The query parameters
        params.append('location', this.location);
        params.append('industry', this.industry);
        params.append('jobType', this.jobType);
        url += '?' + params.toString(); // Append the parameters to the URL
        
        fetch(token, 
        {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            
            body: new URLSearchParams({
                'grant_type' : 'client_credentials',
                'client_id' : clientId,
                'client_secret' : clientSecret
            })
        })
        .then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response.json();
        })
        .then(data => {
            console.log('Access Token:', data.access_token);
            fetch(url, { method: 'GET',
                headers: { 'Content-Type': 'application/json', 
                'Authorization' : 'Bearer ' + data.access_token
                },
            }) // Make the GET request
            .then((response) => {
                if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
                }
                return response.json(); // Parse the JSON response
            })
            .then((result) => {
                this.jobListings = result; // Assign the result to the jobs property
            })
            .catch((error) => {
                this.error = error.message; // Handle any error
                this.showToast('ERROR', error.body.message, 'error');
            });
        })
        .catch((error) => {
            this.error = error.message; // Handle any error
            this.showToast('ERROR', error.body.message, 'error');
        });
    }

    @wire(getObjectInfo, {objectApiName: JOB_LISTING_OBJECT})
    jobInfo

    // wire the getPicklistValues adapter to get the industry options
    @wire(getPicklistValues, { recordTypeId: '$jobInfo.data.defaultRecordTypeId', fieldApiName: INDUSTRY_FIELD })
    wiredIndustryValues({ data, error }) {
        if (data) {
            this.industryOptions = [{ label: 'None', value: '' },...data.values];
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.industryOptions = undefined;
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    // wire the getPicklistValues adapter to get the job type options
    @wire(getPicklistValues, { recordTypeId: '$jobInfo.data.defaultRecordTypeId', fieldApiName: JOB_TYPE_FIELD })
    wiredJobTypeValues({ error, data }) {
        if (data) {
            this.jobTypeOptions = [{ label: 'None', value: '' },...data.values];
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.jobTypeOptions = undefined;
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    // show a toast message
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}
