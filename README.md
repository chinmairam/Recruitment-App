# Recruitment Application

Recruitment Application built with Apex, Lightning Web Components (LWC), Flows, and custom objects.  
The project supports candidate profile management, job posting/search workflows, interview scheduling, document upload and verification, and lead approval-to-conversion automation.

## Project Overview

Core recruitment capabilities include:

- Candidate profile capture and update (`CandidateProfile__c`)
- Job listing search and filtering (`JobListing__c`) via Apex REST
- Recruiter job posting management (`Job_Posting__c`)
- Interview calendar scheduling (`Interview_Availability__c`)
- Candidate document upload with approval submission
- Lead routing and conversion automation for approved leads

## Architecture

### Key Apex Services

- `JobSearchController`: REST endpoint (`/services/apexrest/jobsearch/`) for filtered job search and job listing creation
- `JobPostingController`: returns active job postings for current user
- `CandidateProfileController` and `ProfileDataLwcController`: candidate profile read/update logic
- `InterviewController` and `InterviewAvailabilityController`: interview calendar CRUD support
- `FileController` and `DocumentUploadController`: content retrieval and post-upload approval submission
- `LeadConversionHandler`: converts approved leads and creates partner community users

### Triggers and Automation

- `LeadConversion.trigger`: invokes conversion logic after lead updates
- `FileUploadTrigger.trigger`: reacts to `ContentDocumentLink` inserts
- `Change_Lead_Owner.flow-meta.xml`: active record-triggered Flow to assign Lead owner by `Region__c` queue

### Lightning Web Components (selected)

- `jobSearch1`: job search UI with picklist filters and REST integration
- `jobPostings` / `jobPostingNew`: recruiter-facing job posting management
- `customCalendar`, `interviewScheduler1`, `interviewScheduler2`: interview scheduling calendars
- `candidateProfile`, `profileData`, `verificationStatusComp`: candidate profile and verification views
- `fileUpload`, `previewFileModal`, `previewFileThumbnailCard`: file upload and file preview flow

## Custom Objects (primary)

- `CandidateProfile__c`
- `JobListing__c`
- `Job_Posting__c` (referenced in Apex/LWC)
- `Interview_Availability__c` (referenced in Apex/LWC)

Note: `Job_Posting__c` and `Interview_Availability__c` are referenced throughout code and must exist in the target org schema.

## Prerequisites

- [Salesforce CLI (`sf`)](https://developer.salesforce.com/tools/salesforcecli)
- Node.js (LTS) and npm
- A Salesforce org (scratch org, dev org, or sandbox)
- Access to required profiles/queues/community setup used by automation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Authenticate to your org:

```bash
sf org login web --alias recruitment-org
```

3. Deploy metadata:

```bash
sf project deploy start --target-org recruitment-org --source-dir force-app
```

4. (Optional) assign permissions and import sample data as needed for your org.

## Scratch Org Flow (optional)

Create and open a scratch org from included definition:

```bash
sf org create scratch --definition-file config/project-scratch-def.json --set-default --alias recruitment-scratch
sf project deploy start --target-org recruitment-scratch --source-dir force-app
sf org open --target-org recruitment-scratch
```

## Run Quality Checks

### Lint

```bash
npm run lint
```

### Prettier

```bash
npm run prettier:verify
```

## Apex Tests

Run Apex tests in org:

```bash
sf apex run test --target-org recruitment-org --test-level RunLocalTests --result-format human
```

## External and Org Configuration Notes

This project references configuration that is org-specific and should be validated after deployment:

- Custom Labels used by `jobSearch1`:
  - `CORE_REST_URL`
  - `CORE_TOKEN_URL`
  - `Job_Client_Id`
  - `Job_Client_Secret`
- Static Resources used by UI components:
  - `ChartJs`
  - `FullCalendarJS`
  - `FullCalendarCustom`
  - `fullcalendarv3`
- Community and portal setup used by registration/login controllers
- `Partner Community User` profile and queue names (`Central_Queue`, `North_Queue`, `South_Queue`, `East_Queue`, `West_Queue`)

## Repository Structure

```text
.
|- config/                         # Scratch org definition
|- force-app/main/default/
|  |- classes/                     # Apex controllers, handlers, tests
|  |- lwc/                         # Lightning Web Components
|  |- objects/                     # Object metadata and fields
|  |- triggers/                    # Trigger entry points
|  |- flows/                       # Flow automation
|- manifest/package.xml            # Metadata API package manifest
|- package.json                    # Node scripts and tooling
|- sfdx-project.json               # Salesforce DX project config
```
