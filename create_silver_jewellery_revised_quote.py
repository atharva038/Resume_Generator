from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = "silver_jewellery_shopify_revised_30k_option_b_20rs_product.pdf"


PAGE_W, PAGE_H = A4
MARGIN = 0.72 * inch


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleCenter",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        textColor=colors.HexColor("#111827"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="SubtitleCenter",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=11,
        leading=16,
        textColor=colors.HexColor("#4b5563"),
        spaceAfter=22,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=20,
        textColor=colors.HexColor("#1f2937"),
        spaceBefore=14,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontSize=9.2,
        leading=13,
        textColor=colors.HexColor("#111827"),
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#4b5563"),
    )
)
styles.add(
    ParagraphStyle(
        name="TableHeader",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )
)


def p(text, style="Body"):
    return Paragraph(text, styles[style])


def bullet(text):
    return p("&bull;&nbsp;&nbsp;" + text)


def table(data, widths=None, header_color="#374151", highlight_last=False):
    wrapped = []
    for row_index, row in enumerate(data):
        cell_style = "TableHeader" if row_index == 0 else "Small"
        wrapped.append([cell if hasattr(cell, "wrap") else p(str(cell), cell_style) for cell in row])
    if widths is None:
        widths = [1.7 * inch, 3.4 * inch, 1.45 * inch]

    t = Table(wrapped, colWidths=widths, hAlign="LEFT", repeatRows=1)
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(header_color)),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for row in range(1, len(data)):
        commands.append(("BACKGROUND", (0, row), (-1, row), colors.HexColor("#f8fafc") if row % 2 == 0 else colors.white))
    if highlight_last:
        commands.append(("BACKGROUND", (0, len(data) - 1), (-1, len(data) - 1), colors.HexColor("#fef3c7")))
        commands.append(("FONTNAME", (0, len(data) - 1), (-1, len(data) - 1), "Helvetica-Bold"))
    t.setStyle(TableStyle(commands))
    return t


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.drawString(MARGIN, 0.42 * inch, "Prepared by Atharva Sachin Joshi | Shopify Silver Jewellery Ecommerce Quotation")
    canvas.drawRightString(PAGE_W - MARGIN, 0.42 * inch, f"Page {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=0.65 * inch,
    bottomMargin=0.75 * inch,
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="quotation", frames=[frame], onPage=footer)])


story = []

story += [
    p("REVISED DETAILED QUOTATION", "TitleCenter"),
    p("Complete Shopify Ecommerce Setup for Silver Jewellery Business", "SubtitleCenter"),
    table(
        [
            ["Prepared For", "Silver Jewellery Business Owner"],
            ["Prepared By", "Atharva Sachin Joshi"],
            ["Project Type", "Shopify Store + Ecommerce Operations Planning"],
            ["Product Volume", "500+ silver jewellery products, variants applicable"],
            ["Quotation Date", "02 June 2026"],
            ["Validity", "15 days from quotation date"],
        ],
        widths=[2.0 * inch, 4.0 * inch],
        header_color="#374151",
    ),
    Spacer(1, 14),
    table(
        [
            ["Commercial Revision Note"],
            [
                "Option A has been revised to a final non-negotiable price of INR 30,000. "
                "Option B is adjusted according to the product upload rate of INR 20 per product. "
                "For 500 products, product upload is INR 10,000, making Option B INR 40,000 onwards."
            ],
        ],
        widths=[6.0 * inch],
        header_color="#92400e",
    ),
]

story += [
    p("1. Project Understanding", "Section"),
    bullet("The business wants to sell silver jewellery online using Shopify."),
    bullet("The product catalog is expected to contain 500+ products."),
    bullet("Products may have variants such as size, weight, polish, design, stone type, finish, or price difference."),
    bullet("The client needs ecommerce account guidance, domain connection, payment workflow, shipping workflow, launch planning, and optional ads or management support."),
    bullet("Product photography and ongoing ecommerce management are separate from the one-time Shopify setup unless specifically added."),
    p("2. Recommended Project Structure", "Section"),
    table(
        [
            ["Component", "Purpose", "Pricing Type"],
            ["Shopify store setup", "Create and configure the online store", "One-time"],
            ["Product upload and variants", "Upload/organize products, images, pricing, SKUs, and variants", "Per product / batch-wise"],
            ["Photography", "Product shoot, editing, naming, and matching images to SKUs", "Separate"],
            ["Store management", "Monthly updates, orders, stock coordination, and support", "Monthly"],
            ["Ads management", "Meta/Google setup, campaigns, optimization, and reports", "Monthly + ad budget"],
        ]
    ),
]

story += [
    p("3. Option A - Shopify Store Setup + Launch Package", "Section"),
    p("<b>Suitable For:</b> Client wants the Shopify store structure, design, payment, shipping, domain, and launch setup. Daily operations, bulk product upload, ads, and customer/order management are not included in this option."),
    table(
        [
            ["Service", "Details", "Standard Amount"],
            ["Shopify Store Setup", "Shopify account guidance, basic settings, currency, store configuration, checkout basics", "Included"],
            ["Premium Jewellery Website Design", "Luxury silver jewellery theme setup, homepage design, header, footer, and mobile layout", "Included"],
            ["Pages Setup", "About Us, Contact Us, Privacy Policy, Refund Policy, Shipping Policy, Terms and Conditions", "Included"],
            ["Collections / Categories Setup", "Rings, earrings, bracelets, chains, anklets, new arrivals, best sellers, and required categories", "Included"],
            ["Payment Gateway Guidance", "Razorpay/payment workflow guidance; KYC and approval remain client responsibility", "Included"],
            ["Shipping Workflow Guidance", "Shiprocket/manual shipping workflow guidance and shipping settings", "Included"],
            ["Domain Connection", "Domain setup and connection guidance", "Included"],
            ["Launch Testing", "Mobile checks, basic checkout checks, navigation checks, and final handover", "Included"],
            ["Final Option A Price", "Final non-negotiable revised package price", "INR 30,000"],
        ],
        highlight_last=True,
    ),
    p("Option A Includes", "Section"),
    bullet("Complete Shopify store setup and launch-ready structure."),
    bullet("Premium jewellery website theme customization using Shopify theme editor."),
    bullet("Homepage, collections, policy pages, contact flow, mobile layout, and launch testing."),
    bullet("Up to 25 sample product uploads only for structure/demo purpose."),
    p("Option A Does Not Include", "Section"),
    bullet("Bulk upload of 500+ products."),
    bullet("Complex variant setup for all products."),
    bullet("Product photography, photo editing, model shoot, studio setup, or image retouching."),
    bullet("Monthly store management, customer support, order handling, or ads management."),
]

story += [
    p("4. Option B - Complete Store Setup + 500 Product Upload Package", "Section"),
    p("<b>Suitable For:</b> Client wants the complete Shopify store launched with 500 products uploaded and organized. Monthly store management, advertising, and photography are still quoted separately."),
    table(
        [
            ["Service", "Details", "Amount"],
            ["Option A Store Setup + Launch Scope", "Complete Shopify setup, premium design, pages, categories, payment, shipping, domain, mobile optimization, and launch testing", "INR 30,000"],
            ["Product Upload - 500 Products", "Product title, price, category, image upload, basic description, and tags at INR 20 per product", "INR 10,000"],
            ["Basic Product Organization", "Basic category mapping and simple product data organization", "Included"],
            ["Adjusted Complete Package Price", "Option A INR 30,000 + 500 products x INR 20", "INR 40,000 onwards"],
        ],
        highlight_last=True,
    ),
    p("Product Upload Rate", "Section"),
    table(
        [
            ["Product Quantity", "Rate", "Upload Amount"],
            ["500 products", "INR 20 per product", "INR 10,000"],
            ["Additional products", "INR 20 per product", "As per actual count"],
        ],
        widths=[2.0 * inch, 2.0 * inch, 2.0 * inch],
        header_color="#047857",
    ),
    p("Important Product Upload Notes", "Section"),
    bullet("Client must provide final product names, prices, categories, SKU/product codes, images, and available variant data."),
    bullet("Advanced copywriting, advanced SEO descriptions, bulk image editing, or complex variant cleanup can be quoted separately if required."),
    bullet("If product data is incomplete or inconsistent, timeline and pricing may be adjusted according to the extra cleanup required."),
]

story += [
    p("5. Monthly Store Management Optional", "Section"),
    table(
        [
            ["Monthly Work", "Details", "Price"],
            ["Store Management Retainer", "Order coordination support, product updates, stock coordination, basic content updates, and support", "INR 18,000 per month onwards"],
            ["Extra product updates beyond agreed monthly limit", "Charged separately based on quantity and work complexity", "Separate"],
            ["Minimum commitment", "One month", "1 month"],
        ],
        header_color="#6d28d9",
    ),
    p("6. Optional Ads Setup and Ads Management", "Section"),
    table(
        [
            ["Ads Work", "Amount"],
            ["Meta Business setup", "INR 2,000"],
            ["Pixel/catalog setup", "INR 2,000"],
            ["First campaign setup", "INR 3,000"],
            ["One-time ads setup total", "INR 7,000"],
            ["Monthly ads management", "INR 8,000 per month"],
            ["Ad budget", "Paid separately by client directly to Meta/Google"],
        ],
        widths=[3.0 * inch, 3.0 * inch],
        header_color="#2563eb",
    ),
    p("<b>Ads Disclaimer:</b> Sales are not guaranteed. Ad results depend on product demand, pricing, creatives, audience, budget, competition, website trust, and market response."),
]

story += [
    p("7. Photography", "Section"),
    bullet("Product photography, model shoot, studio setup, photographer charges, and advanced photo editing are not included in Option A or Option B."),
    bullet("Photography can be handled by a separate photographer. We can coordinate the shoot if required, but photography charges will be separate."),
    bullet("Suggested basic product photography may range from INR 30 to INR 80 per product depending on shoot quality, lighting, angles, and editing requirement."),
    p("8. Client Responsibilities / Not Under Our Direct Responsibility", "Section"),
    table(
        [
            ["Responsibility", "Details"],
            ["Product pricing", "Final product price, discounts, silver rate changes, and making charges must be decided by client."],
            ["Stock accuracy", "Client must confirm available stock, sizes, weights, variants, and SKUs."],
            ["Product quality", "Purity, material quality, defects, damage, and replacement responsibility remain with client."],
            ["Packing and dispatch", "Physical product packing and courier handover must be done by client/shop team."],
            ["Refunds and returns", "Final approval for refunds, returns, cancellations, and replacements remains with client."],
            ["Bank/KYC/OTP", "Razorpay, Shopify, Shiprocket, GST, PAN, bank verification, OTP, and KYC must be completed by client."],
            ["Legal/GST compliance", "Business registration, tax, invoice, GST, and legal compliance remain client responsibility."],
            ["Ad budget", "Meta/Google ad spend is paid by client directly and is not included in service charges."],
            ["Sales guarantee", "No guaranteed sales/revenue commitment. Ecommerce performance depends on multiple business and market factors."],
        ],
        widths=[1.8 * inch, 4.2 * inch],
        header_color="#991b1b",
    ),
]

story += [
    p("9. Exclusions", "Section"),
    bullet("Shopify subscription charges."),
    bullet("Domain purchase or renewal charges."),
    bullet("Paid Shopify apps or app subscription charges."),
    bullet("Razorpay payment gateway charges and settlement fees."),
    bullet("Shiprocket shipping charges and courier costs."),
    bullet("Meta/Google ad spend."),
    bullet("Photography, model shoot, studio rental, product styling, and photo editing charges."),
    p("10. Payment Terms", "Section"),
    table(
        [
            ["Milestone", "Option A", "Option B"],
            ["Advance before starting", "50% of final price", "50% of final price"],
            ["After design/store structure approval", "25% of final price", "25% of final price"],
            ["Before final launch/handover", "25% of final price", "25% of final price"],
            ["Monthly management", "Monthly advance", "Monthly advance"],
            ["Ads management", "Monthly advance", "Monthly advance"],
        ],
        widths=[2.65 * inch, 1.65 * inch, 1.65 * inch],
        header_color="#111827",
    ),
    p("11. Timeline Estimate", "Section"),
    table(
        [
            ["Package", "Estimated Timeline"],
            ["Option A - Store Setup + Launch", "10 to 15 working days after receiving details"],
            ["Option B - Setup + 500 Product Upload", "25 to 40 working days depending on product data readiness and variants"],
            ["Ads setup", "3 to 5 working days after store launch and asset readiness"],
            ["Photography", "Timeline depends on photographer, product availability, shoot quality, and retakes"],
        ],
        widths=[2.65 * inch, 3.35 * inch],
    ),
]

story += [
    p("12. Required From Client Before Starting", "Section"),
    bullet("Business name, logo, address, contact number, WhatsApp number, business email, and social links."),
    bullet("Domain preference or existing domain details."),
    bullet("Razorpay/Shiprocket/GST/PAN/business bank readiness."),
    bullet("Final category list for products."),
    bullet("Sample 10 products with images, pricing, weight, SKU, sizes, and variant details."),
    bullet("Final return/refund/cancellation policy decision."),
    bullet("Decision on Option A, Option B, monthly management, ads, and photography scope."),
    p("13. Final Summary", "Section"),
    table(
        [
            ["Package", "Price"],
            ["Option A - Shopify Store Setup + Launch", "INR 30,000"],
            ["Option B - Option A + 500 Product Upload at INR 20/product", "INR 40,000 onwards"],
            ["Monthly Store Management", "INR 18,000/month onwards"],
            ["Ads Management", "INR 8,000/month"],
            ["Photography", "Separate quotation"],
            ["Ad Budget", "Paid separately by client"],
        ],
        widths=[3.7 * inch, 2.3 * inch],
        header_color="#047857",
        highlight_last=False,
    ),
    Spacer(1, 8),
    p("<b>Recommended Plan:</b> For a 500+ product silver jewellery business, Option B with monthly management is recommended. Ads should start after the website, products, payment, shipping, and policies are properly ready."),
]


doc.build(story)
print(OUTPUT)
