Implementation Steps
Step 1: Database Design Decisions
References: Use full document paths as strings ("collection/docId")

Querying: We'll query invoices by projectRef field

Data Integrity: References maintain relationships without complex joins

Step 2: Invoice Creation Flow
Get Project Data → Fetch project + clients

Generate Flutterwave Link → Create payment link with project context

Create Invoice Document → Save to invoices collection

Update Project References → Add invoice reference to project's invoiceRefs array

Send Emails → Notify all project clients

Step 3: Data Fetching Strategy
Get Project Invoices: Query invoices collection where projectRef == "projects/projectId"

Get Single Invoice: Direct access via invoices/invoiceId

Get Project Data: Can fetch project details from invoice's projectRef

Step 4: Reference Management
Adding Invoice: Push new reference to project's invoiceRefs array

Deleting Invoice: Remove reference from project + delete invoice doc

Querying: Use projectRef for efficient filtering

Step 5: Flutterwave Integration
Tx Reference: Include projectId for tracking

Webhook: Update invoice status when payment is successful

Metadata: Store project context in payment metadata

Step 6: Email System
Template: Professional invoice email with payment link

Multiple Clients: Send to all project clients

Tracking: Log email delivery status

