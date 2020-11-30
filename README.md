# Deary
*By Ammar Nassri - [Visit Deary](https://deary-social.herokuapp.com/)*

## Table of Contents:
* [Deary Summary](#deary-summary)
* [Technologies Used](#technologies-used)
* Frontend Overview
* Backend Overview
* Next Steps

## Deary Summary
Deary is a social media website modeled after Facebook. Its objective is to help you stay in touch with the people you  care about. Deary makes it easy to let your close friends and family know about your life events, minor or major. 

![deary gif](./graphics/app-recording-min.gif)

## Technologies Used
Deary is a full-stack application built with a React frontend and a Python/Flask backend. Most of logic occurs in the React frontend. The styling is mostly done with raw CSS, with a tiny help from the [Material UI framework](https://material-ui.com/).

The frontend is served by the backend, which responds to requests, fetches geocoding information from the [Location IQ API](https://locationiq.com/) to the frontend, integrates with AWS S3 for cloud storage, and grabs data from the PostgreSQL database.

## Frontend Overview

Frontend is the core of the Deary app. 

![deary database schema](./documentation/database-schema.png)



