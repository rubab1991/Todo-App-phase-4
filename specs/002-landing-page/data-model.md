# Data Model: Landing Page Content

## Entities

### Feature
Represents a feature to be displayed on the landing page

**Fields**:
- `title`: string - The title of the feature
- `description`: string - A brief description of the feature
- `icon`: ReactNode (optional) - An icon representing the feature

**Relationships**: None

### LandingPageContent
Represents the content structure for the landing page

**Fields**:
- `heroTitle`: string - The main title for the hero section
- `heroSubtitle`: string - The subtitle for the hero section
- `ctaButtons`: Array<Button> - Call-to-action buttons for the hero section
- `features`: Array<Feature> - Features to display in the features section

### Button
Represents a button element on the landing page

**Fields**:
- `text`: string - The text displayed on the button
- `href`: string - The URL to navigate to when clicked
- `variant`: 'primary' | 'secondary' | 'ghost' - The style variant of the button

## Relationships
- LandingPageContent contains multiple Features
- LandingPageContent contains multiple Buttons

## Validation Rules
- Feature.title must be 2-50 characters
- Feature.description must be 10-200 characters
- Button.text must be 1-30 characters
- Button.href must be a valid URL path

## State Transitions
None required for static landing page content.