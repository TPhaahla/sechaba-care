# Some Project Notes
The proposed project aims to develop a comprehensive Client Registration and Medication Management System to efficiently manage clients' medical information and prescribed medications.

The project follows a client-server model. The client is built using [NextJS with Typescript](https://nextjs.org/docs/getting-started/installation) and the server application is a python [FastAPI Application](https://fastapi.tiangolo.com).

Overall, the project has fallen short of expectation due to various reasons. The main two being project risks that were not planned for and consistent time-resource allocation that was inline with the project requirements which were underestimated.


# Ommitted Functionality
- SMS Notifications
  - The primary reason for ommiting this functionality is because this stage of the project prioritised keeping costs to a minimum or at zero where possible so as to not incur unnecessary costs for functions that wwill not be used.

# Project Plan

### Project Status: Incomplete

### Stage 1: Prototyping and Requirements Validation
This stage involves creating an minimum viable product. This can almost be seen as a proof of concept stage. The approach taken here was largely experimental. For example  the forms use both [Formik](https://formik.org) and [Zod](https://zod.dev) for input validation whereas only one of these is needed. Another example of experimentation is that this project makes use of [TailwindCSS](https://tailwindcss.com), [Styled Components](https://styled-components.com) as well as base CSS. It is not necessary to make use of all these libraries as they largely provide the same functionality, but it was helpful to evaluate which is best for this project as well as which of these is easiest for new team members to get up to speed with. This approach, although valuable, has unsurprisngly affected deliverable timelines negatively.

Testing at this stage was not prioritised as it was not seen that this version of the application would translate to the production version, but rather would be used for presentations and to communicate development capabilities and limitations.

#### Key Takeaway:
The time requirements for this project were largely underestimted and this project is not production ready, but it can be with some refarctoring and more robust testing protocols being implemented.

### Stage 2: Market Validation
At this stage there is a tangible product to show potential customers. The strategy here is to involve Doctors and Pharmacists in order to better understand their daily patterns and needs. Evaluating this allows for the project to be build in a way which fits into their way of working as opposed to adding the requirement of the end users having to adapt the way their work in order to accomodate newer technology.

### Stage 3: Production

The requirements to have a production ready application will be based on what the stakeholders have determined as their primary use cases with the inclusion of users validating the features and use case.
Proposed Steps:
 - ReDesign the User Interface and User Experience, making use of well known design principles and taking into account Human Computer Interactions. This step is important as it ensures you're designing and application that is easy to use and has a high chance og being accepted by it's customer base. This also involves desiging a good looking system which will help create a brand identity.
 - Require a team of 2-3 developers for the project. This will allow for more efficient development provided the developers work together and will ensure a high quality of work if each developer is aware that their work will be reviewed daily by their peers. It's also provides an environment for pair programming which can be a great tool for learning and identifying bugs and bottlenecks sooner.
- Setup and structure the developement CI/CD pipeline as well as validate the application architecture for the required level of scalability, which will be informed by the market sie and the potential market capitalisation for Sechaba Care.

# Demo Video at Current State
- [Demo Video Link - Google Drive](https://drive.google.com/drive/folders/1epGd69XmIwD8ZYxHhVAoyj82ADLBnA63?usp=sharing)

### Diagram
  <img width="779" alt="Screenshot 2024-02-06 at 15 20 33" src="https://github.com/TPhaahla/sechaba-care/assets/72293519/244643fb-68f1-428f-bf52-4382a79c3f97">

# Email Notification Screenshots
Email testing for this project makes use of [Mailtrap](https://mailtrap.io/) by [railsware](https://railsware.com/).
This has allowed for emails to not acccidentally be sent out to the public during testing, but rather to be stored in a mailtrap inbox for further evaluation throughout testing.

### Email Verification
<img width="1440" alt="Screenshot 2024-02-05 at 14 54 32" src="https://github.com/TPhaahla/sechaba-care/assets/72293519/f2c76ffe-2012-4757-bc33-b222c0df4d8a">

### Issued Prescription Notification
- Pending Screenshot Upload

### Filled Prescription Notification
- Pending Screenshot Upload
  
### Dispensed Medication Notification
- Pending Screenshot Upload
