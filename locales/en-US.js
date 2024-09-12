import localeAntd from "antd/lib/locale/en_US";

const messages = {
  "actionButton.changeprofile": "Change Profile",
  "actionButton.changeReportSchedule": "Change Report Schedule",
  "actionButton.applicationReview": "Application Review",
  "actionButton.DonorDetailsBudget": "Donor Details Budget",
  "actionButton.completeGrant": "Complete Grant",
  "actionButton.collaborationAgreement": "Collaboration Agreement",
  "actionButton.scoringReview": "Scoring Review",
  "actionButton.applicantscoring": "Applicant Scoring",
  "actionButton.createUnlinkedApplication": "Create Unlinked Application",
  "actionButton.createorganization": "Create Organization",
  "actionButton.customerProfile": "Customer Profile",
  "actionButton.customerApplications": "Customer Applications",
  "actionButton.scoringView": "Scoring View",
  "actionButton.changeFinancing": "Change Financing",
  "actionButton.downloadPdf": "Download PDF",
  "actionButton.createOrganizationSuccess":
    "Process successfully started. Expect e-mail in the following 30 minutes. Please check SPAM if the e-mail doesn't arrive in that period",
  "actionButton.joinorganization": "Join Organization",
  "actionButton.joinfosm": "Join Eko-svest",
  "actionButton.relatedtasks": "Related Tasks",
  "actionButton.onlyMyTasks": "Only My Tasks",
  "actionButton.recentlyUpdated": "Recently Updated",
  "actionButton.addapplicationstomeeting": "Applications To Meeting",
  "actionButton.boarddecision": "Board Decision",
  "actionButton.boarddecisionmeeting": "Board of Directors Meeting",
  "actionButton.organizemeeting": "Organize the meeting",
  "actionButton.createMoM": "Create MoM",
  "actionButton.paymentOrder": "Create Payment Order",
  "actionButton.staffmeeting": "Staff Meeting",
  "actionButton.submitProfile": "Submit Profile",
  "actionButton.createAppTemplate": "Create New Template",
  "actionButton.newDonorProjects": "New Donor Project",
  "actionButton.newTender": "New Tender",
  "actionButton.newMeeting": "New Meeting",
  "actionButton.tenderApplicationAssessment": "Application Assessment",
  "actionButton.tenderChangeReviewer": "Change Reviewer",
  "actionButton.tenderFinalScore": "Final Score Confirmation",
  "actionButton.applicantUploadReport": "Upload Report",
  "actionButton.cff": "Create FormIO instance",
  "actionButton.myProcesses": "My Processes",
  "actionButton.createFiche": "Create Fiche",
  "actionButton.editFiche": "Edit Fiche",
  "actionButton.viewFiche": "View Fiche",
  "actionButton.budgetReassignment": "Budget Reassignment",
  "actionButton.reportProlongation": "Report Prolongation",
  "actionButton.removeUser": "Remove user",
  "actionButton.addFile": "Add File",
  "application.status": "Status: ",
  "application.new": "New",
  "application.blockChanges": "Block Changes",
  "application.complete": "Complete",
  "application.readyForReview": "Ready For Review",
  "application.readyForScoring": "Ready For Scoring",
  "application.scored": "Scored",
  "application.pendingFicheChanges": "Pending Fiche Changes",
  "application.readyForBoard": "Ready For Board",
  "application.pendingBoardDecision": "Pending Board Decision",
  "application.approvedForAdjustment": "Approved For Adjustment",
  "application.incomplete": "Incomplete",
  "application.approved": "Approved",
  "application.rejected": "Rejected",
  "application.saveDraft":
    "There are some missing information in your application. Would you like to save a draft version of your application?",
  "application.description":
    "Below is a listing of all the current applications available for review and update. Click on the edit button to update the score and comment for the selected record. Additional modification can be done on the right panel.",
  "application.draftSaved": "Application draft saved",
  "application.created": "Application successfully created!",
  "actionButton.requestreview": "Request profile review",
  "application.saveError": "application.saveError",
  "application.allTemplates": "All Templates",
  "application.organization": "Organization",
  "application.individual": "Individual",
  "application.unrelated": "Unrelated",
  "application.status.new": "Please complete the data!",
  "application.status.blockChanges": "Changes are blocked!",
  "application.status.complete": "Data complete",
  "application.status.readyForReview": "This application is ready for review!",
  "application.status.readyForScoring":
    "This application is currently being assessed.",
  "application.status.incomplete":
    "Your application is Incomplete. Please make sure you properly completed the application.",
  "application.status.scored": "Scoring of application completed.",
  "application.status.pendingFicheChange": "Pending fiche change.",
  "application.status.readyForBoard": "This application is ready for board.",
  "application.status.pendingBoardDecision": "Pending board decision.",
  "application.status.approved": "This application is approved.",
  "application.status.approvedWithAdjustment":
    "This application is approved with budget reduction.",
  "application.status.signed": "Contract is signed.",
  "application.status.rejected": "This application has been rejected.",
  "application.status.rejectedAdjustment":
    "Applicant rejected budget adjustment",
  "application.delete": "Are you sure you want to delete this application?",
  "application.deleted": "Successfully deleted the selected application",
  "contact.phone": "Phone",
  "contact.email": "E-mail",
  "contact.mobile": "Mobile",
  "contact.fax": "Fax",
  "filter.applicationInput": "Filter by applicant name . . .",
  "filter.registrationComplete": "Registration Complete",
  "filter.signed": "Signed",
  "filter.approved": "Approved",
  "filter.running": "Running",
  "filter.execution": "Execution",
  "filter.stopped": "Stopped",
  "filter.paused": "Paused",
  "filter.error": "Error",
  "filter.initialized": "Initialized",
  "filter.finished": "Finished",
  "filter.closed": "Closed",
  "filter.cancelled": "Cancelled",
  "filter.scheduled": "Scheduled",
  "filter.new": "New",
  "filter.completed": "Completed",
  "filter.idInput": "Filter by id . . .",
  "filter.formInput": "Filter by name . . .",
  "filter.applicationDropdown": "Filter by status . . .",
  "filter.meetingInput": "Filter by title . . .",
  "filter.meetingDropdown": "Filter by status . . .",
  "filter.FilterButton": "Filter",
  "filter.ResetButton": "Reset",
  "message.warning": "Warning",
  "message.tenderExpired": "Tender application time has finished",
  "button.applications": "Applications",
  "button.view": "View",
  "button.fiche": "Fiche",
  "button.show": "Show",
  "button.submit": "Submit",
  "button.details": "Details",
  "button.reassign": "Reassign",
  "button.cancel": "Cancel",
  "button.completetask": "Complete Task",
  "button.delete": "Delete",
  "button.edit": "Edit",
  "button.reset": "Reset",
  "button.search": "Search",
  "button.saveTemplate": "Save Template",
  "button.saveTemplateDraft": "Save Template Draft",
  "button.next": "Next",
  "button.previous": "Previous",
  "button.save": "Save",
  "button.addUser": "Add User",
  "button.addDonor": "Add Donor",
  "button.updateAssignees": "Update Assignees",
  "button.update": "Update",
  "button.saveUpdatedBudget": "Save Updated Budget",
  "budget.label": "Requested Budget",
  "fosm.budgetLabel": "Eko-svest Budget",
  "formioedit.save": "Update form",
  "formio.updateError": "Error on form update!",
  "formio.updateSuccess": "Update successful!",
  "formiolist.description":
    "Below is a listing of all the FormIO based forms. Click on the view/edit button access details of the selected form.",
  "context.menuHelper": "Click the dropdown arrow to open the menu",
  "donors.description":
    "Below is a listing of all the current donor projects available for review and update. Click on the view/edit button access details of the selected record.",
  "data.received": "Data received!",
  "data.error": "Error retriving grants ...",
  "grants.received": "Grants received!",
  "grants.error": "Error retriving grants ...",
  "grant.label": "All Active Tenders",
  "grant.definition":
    "Below is a listing of all tender definitions available for review and update. Click on the edit button to update the selected record.",
  "grantdefinitions.received": "Tender definitions received!",
  "grantdefinitions.error": "Error retriving tender definition ...",
  "meetings.description":
    "Below is a listing of all the meetings. Click on the view button to view the data for selected record.",
  "navLink.newNotificationTemplate": "New Template",
  "navLink.allActiveGrants": "All Active Grants",
  "notidication.description":
    "Below is a listing of all notification templates ready for review and update. Click on the edit button to update the template of the selected record.",
  "topBar.processesDetails": "Process Details",
  "title.CallsCanOnlyApplyToASpecificProfileType":
    "Calls can only apply to a specific profile type",
  "title.Cities": "Cities",
  "title.YouCanOnlyApplyToTheCallWithACompletedAndApprovedProfile":
    "You can only apply to the call with a completed and approved profile",
  "title.LocationsOfTheNGOsCities": "Locations Of The NGOs Cities",
  "title.organizationProfile": "Organization Profile",
  "title.individualProfile": "Individual Profile",
  "title.createNewApplication": "Create New Application",
  "loader.processes": "Loading all processes ...",
  "loader.applicant": "Loading applicant details . . .",
  "loader.userTasks": "Loading your work board . . .",
  "loader.meeting": "Loading meeting . . .",
  "loader.form": "Loading form . . .",
  "loader.saving": "Saving data . . .",
  "legal.LocalGovernmentUnit": "Local government unit",
  "legal.AssociationOfCitizens": "Association of citizens",
  "legal.PublicInstitution": "Public Institution",
  "legal.TradingCompany": "Trading company",
  "profile.delete": "Are you sure you want to delete this profile?",
  "profile.updateSuccess": "Profile update successfully",
  "profile.updateError": "Profile update error",
  "profileStatus.approve": "Your profile is approved.",
  "profileStatus.blocked":
    "Your profile is blocked. Please contact admin for help.",
  "profileStatus.incomplete":
    "Your profile is Incomplete. Please make sure you properly completed the profile.",
  "profileStatus.verification":
    "Your profile is currently under review for verification.",
  "profileStatus.review": "Your profile is ready for review!",
  "profileStatus.new": "Your profile is new. Please complete the data.",
  "scoring.reviewLabel": "Final scoring",
  "topBar.grantNumber": "Grant Number",
  "topBar.customers": "Customers",
  "topBar.customerManagement": "Customer Management",
  "topBar.customerUploadDocument": "Customer Documents",
  "topBar.mainTitle": "Eko-svest",
  "topBar.subTitle": "Grant Distribution & Management",
  "topBar.dashboards": "Dashboards",
  "topBar.administration": "Administration",
  "topBar.applications": "Applications",
  "topBar.applicationfiche": "Application Fiche",
  "topBar.editApplicationFiche": "Update Fiche",
  "topBar.viewApplicationFiche": "View Fiche",
  "topBar.application": "Application",
  "topBar.allapplications": "All Applications",
  "topBar.viewApplication": "View Application",
  "topBar.editApplication": "Edit Application",
  "topBar.roles": "Roles",
  "topBar.welcome": "Welcome, ",
  "topBar.Tasks": "Tasks",
  "topBar.Notasks": "No tasks",
  "topBar.Events": "Events",
  "topBar.Noevents": "No events",
  "topBar.Actions": "Actions",
  "topBar.Noactions": "No actions",
  "topBar.profile": "Profile",
  "topBar.Selectnewprofile": "Select new profile",
  "topBar.profileThis": "Use this profile",
  "topBar.login": "Login",
  "topBar.logout": "Logout",
  "topBar.register": "Register",
  "topBar.manage": "Manage",
  "topBar.notifications": "Notifications",
  "topBar.createNotification": "Create Notification",
  "topBar.editNotification": "Edit Notification",
  "topBar.viewNotificationDetails": "View Notification Details",
  "topBar.userManagement": "User Management",
  "topBar.apps": "Apps",
  "topBar.grants": "Grants",
  "topBar.formioedit": "Edit FormIO path",
  //'topBar.SwitchProfile':'Switching your profile ...',
  "topBar.profiles": "Profiles",
  "topBar.processes": "Processes",
  "topBar.myProcesses": "My Processes",
  "topBar.meetings": "Meetings",
  "topBar.meetingDetails": "Meeting Details",
  "topBar.bodMeetings": "Board of Directors Meetings",
  "topBar.staffMeetings": "Staff Meetings",
  "topBar.userTasks": "Tasks",
  "topBar.budget": "Budget",
  "topBar.details": "Details",
  "topBar.createAnApplication": "Create an Application",
  "topBar.createAnNewApplication": "Create an new Application",
  "topBar.grantDefinitionDetails": "View Tender Definition Details",
  "topBar.createGrandApplicationTemplate": "Create Grant Application Template",
  "topBar.chooseGrantApplicationType": "Choose grant application type",
  "topBar.createIndGrantApplicationTempl":
    "Create Individual Grant Application Template",
  "topBar.createOrgGrantApplicationTempl":
    "Create Organization Grant Application Template",
  "topBar.editApplicationTemplate": "Edit Application Template",
  "topBar.grantDefinition": "Tender Definition",
  "topBar.GrantDefinitions": "Tender Definitions",
  "topBar.myapplications": "My Applications",
  "topBar.mygrants": "My Grants",
  "topBar.tender": "Tender",
  "topBar.tenders": "Tenders",
  "topBar.donors": "Donors",
  "topBar.tenderExpires": "Tender Expires At:",
  "topBar.grantApplicationTemplates": "Application Templates",
  "topBar.applicationReview": "Application Review",
  "topBar.activeGrants": "Apply For Grant",
  "topBar.activeGrantsTemplates": "Application Templates",
  "topBar.allaActiveTenders": "All Active Tenders",
  "topBar.allaActiveTendersS": "Unlinked aplications",
  "topBar.createTenderDefinition": "Create Tender Definition",
  "topBar.editDefinition": "Edit Definition",
  "topBar.completeWizard": "Complete the wizard below",
  "topBar.completeForm": "Complete the form below",
  "topBar.customer": "Customer",
  "topBar.grant": "Grant",
  "topBar.definitions": "Definitions",
  "topBar.donorProjects": "Donor Projects",
  "topBar.newDonorProjects": "New Donor Projects",
  "topBar.analytics": "Analytics",
  "topBar.statistics": "Statistics",
  "topBar.homePage": "Home Page",
  "topBar.helpdesk": "Helpdesk",
  "topBar.options": "Options",
  "topBar.orders": "Orders",
  "topBar.formio": "FormIO",
  "topBar.formiolist": "FormIO forms list",
  "topBar.reports": "Reports",
  "topBar.applicationForCall": "Application For Call",
  "topBar.NumberOfGivenTenders": "Number Of Given Tenders",
  "topBar.NumberOfCallsForGrants": "Number Of Calls For Grant",
  "topBar.TotalAmountOfMoneyGivenForGrants":
    "Total Amount Of Money Given For Grants",
  "statistics.TotalAmountOfGrants": "Total Amount Of Grants",
  "title.NumberOfProjectAdmissions": "Number Of Project Admissions",
  "title.TotalNumberOfAssociationOfCitizens":
    "Total Number Of Associations Of Citizens",
  "topBar.tenderDetail": "Tender Details",
  "title.id": "Order Number",
  "content.save": "Save Content",
  "title.shortName": "Short Name",
  "title.profileType": "Profile Type",
  "actionButton.sendemailtoapplications": "Send Email To Applications",
  "title.formiolist": "All FormIO-based forms",
  "title.formioTitle": "Form Name",
  "title.formioType": "FormIO Type",
  "buttons.new": "New",
  "logIn.logIn": "Log In",
  "logIn.loginSignUp": "Login and password - request access / sign up",
  "logIn.noAccount": "Don't have an account?",
  "logIn.registerNew": "Register as a new user",
  "login.loadingDashboard": "Preparing your dashboard ...",
  "login.getStarted": "Get Started",
  "login.retry": "Retry",
  "login.hi": "Hi there,",
  "loading.meetingsReceivedSuccess": "Meetings received!",
  "loading.meetingsReceivedError": "Error loading meetings!",
  "getStarted.intro":
    "Welcome to Eko-svest portal. If you're already a member or you are new to Eko-svest, click [Get Started] to start using this platform.",
  "register.welcome": "Welcome!",
  "register.welcomeIntro":
    "Since you are new here, you have to register as one of the following: organization or individual.",
  "message.unsavedApplication":
    "You have unsaved changes, are you sure you want to leave without saving?",
  "statistics.annualGrants": "Годишни повици",
  "statistics.revenueLocationDate": "Revenue by location and date",
  "statistics.awardedGrands": "Awarded grants",
  "statistics.alltimeGrants": "All Time Grants",
  "statistics.revenueToday": "Revenue today",
  "statistics.viewHistory": "View history",
  "statistics.newUsers": "New Users",
  "statistics.goalReached": "Goal Reached",
  "statistics.rejected": "Rejected",
  "statistics.weeklyRejected": "Average Weekly Rejected",
  "statistics.incomeProgress": "Income Progress",
  "statistics.yourApplication": "Your Applications",
  "statistics.weeklyApplications": "Average Weekly Applications",
  "status.new": "New",
  "status.complete": "Complete",
  "status.blockChanges": "Block Changes",
  "status.readyForReview": "Ready For Review",
  "status.readyForScoring": "Ready For Scoring",
  "status.scored": "Scored",
  "status.signed": "Signed",
  "status.pendingFicheChange": "Pending Fiche Change",
  "status.readyForBoard": "Ready For Board",
  "status.pendingBoardDecision": "Pending Board Decision",
  "status.approvedForAdjustment": "Approved For Adjustment",
  "status.incomplete": "Incomplete",
  "status.approved": "Approved",
  "status.rejected": "Rejected",
  "status.closed": "Closed",
  "title.allUsers": "User Management: All users",
  "title.account": "Account",
  "title.applicationName": "Application Name",
  "title.continueLastApplication": "Continue working on your last application",
  "title.clickHere": "Click Here",
  "title.projectId": "Project Id",
  "title.existingApplications": "Existing Applications",
  "title.existingGrantsBelow":
    "Below is a listing of all the current grants available for review and update. Click on the edit button to update the score and comment for the selected record. Additional modification can be done on the right panel.",
  "title.projectTitle": "Project Title",
  "title.title": "Title",
  "title.theApplicationHasAlreadyBeenCompleted":
    "The Application Has Already Been Completed",
  "title.description": "Description",
  "title.date": "Date",
  "title.status": "Status",
  "title.tender": "Tender",
  "title.budget": "Budget",
  "title.actions": "Actions",
  "title.grant": "Grant",
  "title.budgetAmount": "Budget Amount",
  "title.currency": "Currency",
  "title.paidTo": "Paid to",
  "title.action": "Action",
  "title.documents": "Documents",
  "title.apply": "Apply",
  "title.applyNewUnrelated": "Create New Application Not Related With a Tender",
  "title.baselineNetwork": "Baseline Network",
  "title.donorProjects": "Donor Projects",
  "title.donors": "Donors",
  "title.donor": "Donor",
  "title.existingGrants": "Existing Grants",
  "title.implementationPeriod": "Implementation Period",
  "title.totalBudget": "Total Budget",
  "title.total": "Total",
  "title.fullName": "Full Name",
  "title.name": "Name",
  "title.taxNumber": "Tax Number",
  "title.notificationTemplates": "Notification templates",
  "title.info": "Info",
  "title.budgetOverview": "Budget Overview",
  "title.available": "Аvailable",
  "title.spent": "Spent",
  "title.period": "Period",
  "title.startDate": "Start Date",
  "title.endDate": "End Date",
  "title.duration": "Duration",
  "title.amount": "Amount",
  "title.amountOC": "Amount OC",
  "title.approved": "Approved",
  "title.project": "Project",
  "title.amountGrantCurrency": "Amount Grant Currency",
  "title.applicant": "Applicant",
  "title.allTenderDefinitions": "Аll Tender Definitions",
  "title.templateName": "Template Name",
  "title.comment": "Comment",
  "title.awardedAmount": "Awarded Amount",
  "title.availableAmount": "Available Amount",
  "title.editTemplate": "Edit Template",
  "title.cloneTemplate": "Clone Template",
  "title.users": "Users",
  "title.useTemplate": "Use Template",
  "title.chooseAppType": "Choose an application type",
  "title.applicationReview": "Application Review",
  "title.score": "Score",
  "title.year": "Year",
  "title.createApplication": "Create Application",
  "title.general": "General",
  "title.generalOverview": "General Overview",
  "title.topGrants": "What are your top grants?",
  "title.budgetAssignees": "Budget Assignees",
  "title.selectAssignee": "Select Assignee to add to this Budget",
  "title.mandatoryDataNotEntered": "Mandatory data not entered!",
  "title.processesReview": "All Processes",
  "title.grantNumber": "Grant Number",
  "title.type": "Type",
  "title.financing": "Financing",
  "title.overview": "Overview",
  "title.outflows": "Outflows",
  "title.areYouSure": "Are you sure?",
  "message.unsavedChanges":
    "You have unsaved changes, are you sure you want to leave without saving?",
  "processes.description":
    "View all processes below and perform actions on them",
  "topBar.profileMenu.editProfile": "Edit Profile",
  "topBar.profileMenu.switchProfile": "Switch Profile",
  "topBar.profileMenu.role": "Role",
  "content.profile": "My Profile",
  "content.thisIs": "This is ",
  "content.updateProfilePrivate": "personal profile ",
  "content.updateProfileLegal": "organizaiton profile ",
  "content.updateProfilePrivateText": "and is filled with personal data.",
  "content.updateProfileLegalText": "and is filled with personal data.",
  "content.updateProfile":
    "Fill in all required fields and submit your profile for review. If there are unfilled mandatory fields, the profile cannot be sent for review and approved.",
  "content.updateProfile1":
    "If there are unfilled mandatory fields, the profile cannot be sent for review and approved.",
  "content.settings": "Settings",
  "content.editProfile": "Edit profile",
  "content.cancel": "Cancel",
  "content.saveDraft": "Save draft",
  "content.saveProfile": "Save",
  "content.submitApplication": "Submit Application",
  "topBar.users": "Users",
  "content.submitFiche": "Submit Fiche",
  "content.doYouWantToContinue": "Do You want to continue?",
  "context.actions": "More Actions",
  "content.manual": "You can find the manual on the main page.",
  "content.generateReport": "Generating Report ...",
  "content.generatedReportDownload": "Report generated. Downloading now ...",
  "content.generateReportError": "Generate Report catch error: ",
  "context.createOrder": "Create Payment Order",
  "context.uploadReport": "Upload Report",
  "dropdown.info": "Click the dropdown arrow to open the menu",
  "processing.complete": "Processing complete ...",
  "review.applicationsReceivedSuccess": "Applications received!",
  "review.applicationsReceivedError": "Error fetching applications ...",
  "review.applicationsScoreSuccess": "Application score updated!",
  "review.applicationsScoreError": "Error updating score ...",
  "review.applicationUpdateSuccess": "Application updated!",
  "review.applicationUpdateError": "Error updating application ...",
  "thankYou.title": "Registration Complete!",
  "thankYou.subText": "Your registration was successful.",
  "thankYou.nextSteps.title": "Next steps ...",
  "thankYou.nextSteps.description":
    "Describe to the user what to do next ... Maybe the verification procedure ...",
  "thankYou.verify": "Verify Account",
  "thankYou.login": "Login",
  "user.updateSuccess": "user.updateSuccess",
  "user.updateError": "user.updateError",
  "user.usersReceivedSuccess": "user.usersReceivedSuccess",
  "user.usersReceivedError": "user.usersReceivedError",
  "userProfile.grantApplications": "Status: Grant Applications",
  "userProfile.completed": "Status: Completed",
  "actionButton.setDefaultProfile": "Status: Set as default profile",
  "userStatus.approved": "Status: Approved",
  "userStatus.blocked": "Status: Blocked",
  "userStatus.incomplete": "Status: Incomplete",
  "userStatus.checking": "Status: Checking",
  "userStatus.readyForChecking": "Status: Ready For Checking",
  "userStatus.new": "Status: New",
  "user.approved": "Approved",
  "user.blocked": "Blocked",
  "user.incomplete": "Incomplete",
  "user.checking": "Checking",
  "user.readyForChecking": "Ready For Checking",
  "user.new": "New",
  "workflow.starting": "Initiating workflow ...",
  "workflow.success": "Workflow sucessfully started",
  "workflow.drawerclose": "Close drawer",
  "scoring.label": "Scoring Information",
  "confirm.appDraft":
    "There are some missing information in your application. Would you like to save a draft version of your application?",
  "fosm.proposedBudget": "Proposed Budget",
  "fosm.finaleComment": "Finale Comment",
  "fosm.finalScore": "Final Score",
  "footer.disclaimer1":
    '"Граѓанските организации во акција за климатските промени” е финансиски поддржан од',
  "footer.disclaimer2":
    "страна на Шведска. Изразените ставови и мислења се на организациите кои го спроведуваат проектот и нужно не ги одразуваат ставовите и мислењата на  владата на Шведска.",
  "footer.poweredBy": "Powered by",
  "footer.allRights": "All rights reserved.",
  budget: "budget",
  travel: "travel",
  salaries: "salaries",
  honoraria: "honoraria",
  agreements: "agreements",
  equipment: "equipment",
  office: "office",
  communication: "communication",
  publishing: "publishing",
  rent: "rent",
  other: "other",
};

const enLabels = {
  "Do You want to continue?": "Do You want to continue?",
  "Mandatory data not entered!": "Mandatory data not entered!",
  "Enter your email address": "Enter your email address",
  "Sign in": "Log in",
  "Your first name": "Your first name",
  "Your last name": "Your last name",
  Username: "Username",
  "Email Address": "Email Address",
  "Phone number": "Phone number",
  "Registration type": "Registration type",
  "Staff that will implement project activities (permanent and/or contracted staff) supported by FOSM":
    "Staff that will implement project activities (permanent and/or contracted staff) supported by FOSM",
  "Basic information": "Basic information",
  "Intended Project Outcomes": "Intended Project Outcomes",
  "Contact information": "Contact information",
  "Edit Profile": "Edit Profile",
  "Save Profile": "Save Profile",
  "Customer with such tax number already exists!":
    "Customer with such tax number already exists!",
  "Tax Number: Tax Number is required": "Tax Number: Tax Number is required",
  "Tax Number is required": "Tax Number is required",
  Unauthorized: "Unauthorized",
  complete: "Submission Complete",
  error: "Please fix the following errors before submitting.",
  submitError:
    "Please check the form and correct all errors before submitting.",
  required: "{{field}} is required",
  unique: "{{field}} must be unique",
  array: "{{field}} must be an array",
  array_nonempty: "{{field}} must be a non-empty array", // eslint-disable-line camelcase
  nonarray: "{{field}} must not be an array",
  select: "{{field}} contains an invalid selection",
  pattern: "{{field}} does not match the pattern {{pattern}}",
  minLength: "{{field}} must have at least {{length}} characters.",
  maxLength: "{{field}} must have no more than {{length}} characters.",
  minWords: "{{field}} must have at least {{length}} words.",
  maxWords: "{{field}} must have no more than {{length}} words.",
  min: "{{field}} cannot be less than {{min}}.",
  max: "{{field}} cannot be greater than {{max}}.",
  maxDate: "{{field}} should not contain date after {{- maxDate}}",
  minDate: "{{field}} should not contain date before {{- minDate}}",
  maxYear: "{{field}} should not contain year greater than {{maxYear}}",
  minYear: "{{field}} should not contain year less than {{minYear}}",
  invalid_email: "{{field}} must be a valid email.", // eslint-disable-line camelcase
  invalid_url: "{{field}} must be a valid url.", // eslint-disable-line camelcase
  invalid_regex: "{{field}} does not match the pattern {{regex}}.", // eslint-disable-line camelcase
  invalid_date: "{{field}} is not a valid date.", // eslint-disable-line camelcase
  invalid_day: "{{field}} is not a valid day.", // eslint-disable-line camelcase
  mask: "{{field}} does not match the mask.",
  stripe: "{{stripe}}",
  month: "Month",
  day: "Day",
  year: "Year",
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
  next: "Next",
  previous: "Previous",
  cancel: "Cancel",
  submit: "Submit Form",
  confirmCancel: "Are you sure you want to cancel?",
  saveDraftInstanceError:
    "Cannot save draft because there is no formio instance.",
  saveDraftAuthError: "Cannot save draft unless a user is authenticated.",
  restoreDraftInstanceError:
    "Cannot restore draft because there is no formio instance.",
  "First name (English)": "First name (English) ",
  "Last name (English)": "Last name (English)",
  "Uploaded Documents": "Uploaded Documents",
  "New documents": "New documents",
  "Enter Document Type": "Enter Document Type",
  "Does any staff member, member of advisory bodies or member of FOSM’s Executive Board also serve as member of your institution/organization and/or hold any financial interest in your institution/organization?":
    "Does any staff member, member of advisory bodies or member of FOSM’s Executive Board also serve as member of your institution/organization and/or hold any financial interest in your institution/organization?",
  "Members Number": "Members Number",
  "Number of permanent /contracted staff":
    "Number of permanent /contracted staff",
  Profile: "PROFILE",
  "Enter a valid 13-digit tax number": "Enter a valid 13-digit tax number",
  "Please complete your task after you have completed the assessment of all applications registered for this tender.":
    "Please complete your task after you have completed the assessment of all applications registered for this tender.",
  Recommendation: "Recommendation",
  "Coordinator recommendation": "Coordinator recommendation",
  "Do you accept the meeting?": "Do you accept the meeting?",
  Type: "Type",
  "Article 5 Text": "Article 5 Text",
};

export default {
  locale: "en-US",
  localeAntd,
  messages,
  enLabels,
};
