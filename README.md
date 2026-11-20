# CultureVerse

CultureVerse is a **custodian-led cultural discovery and experience platform** designed to connect the people who preserve culture with the people who want to discover and experience it.

Culture does not exist only in monuments and destinations. It lives through artisans, folk artists, storytellers, temple custodians, local historians, traditional practitioners and communities.

CultureVerse brings these people, their knowledge, cultural places and experiences into one platform while giving custodians a meaningful role in how their culture is represented and shared.

---

## The Idea

A lot of cultural information is scattered across websites, places, communities and individuals. Travellers can find destinations, but finding the people behind the culture, understanding its context, and accessing authentic experiences is much harder.

CultureVerse is built around a simple idea:

> **The people who preserve culture should have a meaningful role in how that culture is represented, shared and experienced.**

The platform connects:

```text
Custodians
    ↓
Knowledge + Traditions + Experiences
    ↓
Verification + Consent + Provenance
    ↓
CultureVerse
    ↓
Traveller Discovery
    ↓
Learning + Planning
    ↓
Cultural Experiences
    ↓
Booking
    ↓
Value to Custodian / Community
```

Temples are one part of the platform, but CultureVerse is **not limited to temples**.

The platform is intended to cover a broader range of living culture, including:

- Temple custodians and priests
- Artisans and craftspeople
- Folk artists and performers
- Storytellers
- Local historians
- Traditional knowledge holders
- Cultural and community organisations

---

# What the Platform Covers

### Cultural Places

- Temples
- Heritage sites
- Museums
- Cultural spaces
- Other culturally significant locations

### Cultural Practices

- Folk arts
- Traditional crafts
- Rituals
- Food traditions
- Oral traditions
- Performing arts
- Local heritage

### Cultural People

- Artisans
- Folk performers
- Storytellers
- Historians
- Temple custodians
- Traditional practitioners
- Community representatives

### Cultural Experiences

- Craft workshops
- Storytelling sessions
- Heritage walks
- Folk performances
- Traditional food experiences
- Community-led cultural activities

---

# Core Flow

The intended platform experience is:

```text
Discover
   ↓
Understand
   ↓
Meet the Custodian
   ↓
Explore their Knowledge
   ↓
Experience the Culture
   ↓
Book
```

For example:

```text
Traveller interested in folk culture
            ↓
Discovers a tradition
            ↓
Finds a verified practitioner
            ↓
Learns about the tradition
            ↓
Views an available experience
            ↓
Books a session
            ↓
Custodian receives their share
```

---

# Custodian Model

Custodians are central to CultureVerse.

A person does not become a verified custodian simply because their name appears online or because they submit an application.

The intended onboarding model is:

```text
Self Nomination
       OR
Community Referral
       OR
Trusted Organisation Referral
       ↓
Application
       ↓
Review
       ↓
Verification
       ↓
Custodian Profile
```

Verified custodians can contribute knowledge and create cultural experiences.

They can also control how their contributions are represented and, where appropriate, what level of access they allow.

---

# Cultural Knowledge

CultureVerse separates **publicly available information** from **custodian-contributed cultural knowledge**.

Public sources can help discover:

- cultural places
- traditions
- events
- geographical information
- publicly documented history

However, public information is not automatically treated as cultural authority.

The intended knowledge workflow is:

```text
Public / Open Sources
        ↓
Cultural Discovery
        ↓
Potential Cultural Entity
        ↓
Custodian / Community
        ↓
Verification
        ↓
Knowledge Contribution
        ↓
Review + Consent
        ↓
Trusted Cultural Knowledge
```

Custodians can contribute knowledge through text and, in the broader platform, through media such as audio, images and video.

The AI can help structure or organise a contribution, but the custodian remains the authority over their own contribution.

---

# Knowledge Visibility

CultureVerse is designed around different levels of knowledge access:

### Public

Information that can be made available to general travellers.

### Community

Information intended for an appropriate community or authenticated context.

### Restricted

Sensitive information that should not be exposed through normal public discovery or AI retrieval.

This allows cultural knowledge to be shared without assuming that everything should automatically become public.

---

# AI and Cultural Knowledge

The AI component is intended to help travellers understand and explore cultural information.

The principle behind it is:

> **AI can organise and explain approved knowledge; it cannot authorise, authenticate or override it.**

The intended flow is:

```text
Traveller Question
       ↓
Permission Check
       ↓
Retrieve Approved Knowledge
       ↓
Apply Visibility Rules
       ↓
Generate Response
       ↓
Provide Attribution / Context
```

If the platform does not have enough reliable information to answer a question, it should not invent an answer.

The broader implementation is intended to use permission-aware retrieval so that restricted or unapproved knowledge does not accidentally appear in public responses.

---

# Cultural Experiences

Custodians can create experiences based on the culture they preserve or practise.

Examples include:

- craft workshops
- folk performances
- storytelling
- heritage walks
- traditional food experiences
- community-led activities

The intended flow is:

```text
Verified Custodian
       ↓
Create Experience
       ↓
Review / Approval
       ↓
Publish
       ↓
Traveller Discovers
       ↓
Booking
```

---

# Booking and Revenue Model

The platform is designed to create an economic connection between cultural experiences and the people who provide them.

The basic model is:

```text
Traveller Payment
       ↓
Transaction
       ↓
Platform Commission
       +
Custodian / Community Share
```

For example, if an experience costs ₹2,000, the system can calculate the platform commission and custodian share according to the configured commission rate.

Any example split shown in the prototype is **illustrative/configurable** and should not be interpreted as a fixed commercial agreement.

The long-term objective is to ensure that cultural participation can create direct economic opportunities for custodians and communities.

---

# Data Collection

CultureVerse is designed to use different sources for different purposes.

### Open / Public Sources

Used for discovering:

- places
- geographical information
- publicly documented cultural information
- events
- references

### Custodian Contributions

Used for:

- local knowledge
- oral traditions
- community perspectives
- craft practices
- cultural context
- experiences

The intended principle is:

> **Public data helps us discover culture. Custodians help us understand and represent it.**

Publicly scraped or collected information should not automatically be treated as verified cultural knowledge.

Source information and provenance are intended to be retained wherever applicable.

---

# Technology

## Current MVP

The current hackathon prototype primarily uses:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript

### Database

- MongoDB
- Mongoose

### AI

- Gemini-based cultural assistance
- Existing AI service layer

### Authentication

- JWT
- Role-based access

### Maps and Location

- OpenStreetMap-related services
- Map-based discovery

### Payments

- Mock payment provider for demonstrating the transaction flow

---

# Proposed Technical Direction

The larger CultureVerse platform may eventually use additional infrastructure such as:

- PostgreSQL
- PostGIS
- pgvector
- more advanced RAG infrastructure
- multilingual and voice-based knowledge capture
- scalable data ingestion
- recommendation systems
- production payment infrastructure
- stronger observability and deployment infrastructure

These technologies represent the **proposed direction of the larger platform**.

They are **not all implemented in this repository**.

The MVP intentionally uses a simpler implementation to demonstrate the product concept and core workflows within the hackathon timeframe.

---

# Prototype Scope & Technical Note

This repository contains the **hackathon MVP of CultureVerse**.

It was developed primarily to demonstrate the concept, user journeys and feasibility of the platform to the evaluation team.

It should therefore not be interpreted as the complete production implementation of the proposed CultureVerse architecture.

Some areas of the platform are more complete than others. Some functionality is implemented, while other parts are represented through simplified implementations or architectural direction.

In particular:

- The current MVP uses **MongoDB/Mongoose** as its database.
- Some technologies shown in the broader architecture are **planned components rather than technologies currently used by this repository**.
- Some advanced verification, recommendation, data-ingestion and AI capabilities remain part of the proposed next-stage architecture.
- The payment system uses a mock provider for demonstration.
- The current data set is intended for prototype demonstration and is not a representation of a complete production cultural database.
- Real-world custodian onboarding and community validation would require a pilot phase and direct participation from relevant communities.

This distinction is intentional.

```text
Proposed Platform Architecture
              ≠
Current Hackathon MVP
```

The MVP focuses on showing the direction of the platform and demonstrating how its core pieces can work together.

---

# Why the MVP Is Limited

A production version of CultureVerse would require deeper work around:

- identifying legitimate custodians
- community participation
- cultural knowledge permissions
- multiple cultural perspectives
- sensitive knowledge
- multilingual and voice-first onboarding
- data provenance
- scalable data ingestion
- recommendation systems
- experience operations
- payment settlement
- production infrastructure

These areas require real-world validation and should not be treated as solved simply by adding more software.

The current prototype therefore focuses on demonstrating the **core product model**.

---

# Project Architecture

The broader platform is intended to evolve around the following structure:

```text
              PUBLIC / OPEN SOURCES
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       PLACES      TRADITIONS     EVENTS
          │            │            │
          └────────────┼────────────┘
                       ↓
                CULTURAL DISCOVERY
                       ↓
                CUSTODIAN NETWORK
                       ↓
             VERIFICATION + CONSENT
                       ↓
             CUSTODIAN CONTRIBUTION
                       ↓
              TRUSTED KNOWLEDGE
                       ↓
                    RAG / AI
                       ↓
              TRAVELLER DISCOVERY
                       ↓
                  EXPERIENCES
                       ↓
                   BOOKINGS
                       ↓
             CUSTODIAN / COMMUNITY
                    VALUE
```

---

# Development Philosophy

CultureVerse is built around a few principles:

### Custodian first

The people who preserve culture should have a meaningful role in its representation.

### Provenance matters

Cultural information should retain where it came from and, where relevant, who contributed it.

### Consent matters

Not every piece of cultural knowledge needs to be public.

### AI should assist, not replace

AI can help organise and explain information, but should not become the authority over cultural knowledge.

### Start focused

The broader platform can begin with a focused regional pilot and expand after validating the custodian and experience model.

---

# Future Direction

The intended evolution of CultureVerse is:

```text
Temple Discovery
        ↓
Cultural Discovery
        ↓
Custodian Network
        ↓
Verified Cultural Knowledge
        ↓
Cultural Experiences
        ↓
Traveller Bookings
        ↓
Custodian / Community Value
```

The initial focus is on building and validating this model within a focused regional ecosystem before expanding to other communities and regions.

---

# Running the Project

Clone the repository:

```bash
git clone <repository-url>
cd temple-verse
```

Install the dependencies using the package manager and scripts configured in the project.

Create the required environment variables for the services used by the application, including:

```text
MongoDB
JWT authentication
AI provider
Maps / location services
Other configured services
```

Then start the frontend and backend using the development scripts defined in the repository.

---

# Repository Status

**Status: Hackathon MVP / Prototype**

This repository represents the state of CultureVerse developed for hackathon evaluation.

It is intended to provide a working glimpse of the platform and demonstrate its core direction rather than represent a finished production system.

The project will require further engineering, testing, community validation and infrastructure development before being considered production-ready.

---

# Team

## DSOSC

CultureVerse was developed by **DSOSC** as part of **Manipal Hackathon 2026**.

**Problem Statement:** Culture & Community — *Custodian: Culture on Its Own Terms*

**Team ID:** 50610

---

## In one line

> **CultureVerse connects the people who preserve culture with the people who want to discover, understand and experience it.**
