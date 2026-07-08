---
name: presentation-writer
description: Skill instructions for creating and writing beautiful, layout-optimized Markdown presentation decks for Slides PRO.
---

# Writing Presentations for Slides PRO

This skill guides the creation of high-fidelity, premium Markdown presentations optimized for the Slides PRO parser. It ensures slides render beautifully with correct automatic layout detection, grid columns, and speaker notes.

---

## 📐 Slide Separators & Boundaries
Every presentation is divided into individual slides using **three dashes** on a line by itself. Ensure there is a blank line before and after the separator:

```markdown
# Slide One Title
- Point A
- Point B

---

# Slide Two Title
- Point C
```

---

## 🎨 Slide Layout Heuristics
Slides PRO automatically calculates the optimal layout for each slide based on its content. Follow these rules to trigger specific presentation styles:

### 1. Title Slide Layout
*   **Trigger**: A slide containing **only** headings (e.g., `#`, `##`, `###`).
*   **Result**: Centered headers vertically and horizontally, ideal for titles, sections, or concluding slides.
*   **Example**:
    ```markdown
    # NextGen AI Platform
    ## The Future of Autonomous Intelligence
    ```

### 2. Split Layout (Image + Text)
*   **Trigger**: A slide containing exactly one markdown image `![Alt text](image_url)` alongside headers, lists, or paragraphs.
*   **Result**: A 50/50 split screen showing the image on the left side, and the text elements on the right.
*   **Example**:
    ```markdown
    # layout: split
    # Creative Design Philosophy
    ![Minimal Art](https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=800&q=80)
    - Space is the ultimate luxury.
    - Focus on typography and contrast.
    ```

### 3. Code Layout (Code Card + Text)
*   **Trigger**: A slide containing a code block (e.g., ` ```typescript ... ``` `) alongside headings or lists.
*   **Result**: A grid split showing the description text column on the left, and a macOS-themed code card block on the right.
*   **Example**:
    ```markdown
    # Edge Runtime Handler
    - Migration of endpoints to the CDN edge.
    - Zero cold starts.
    
    ```typescript
    export async function GET(req: Request) {
      return Response.json({ active: true });
    }
    ```
    ```

### 4. Default Layout (Standard Presentation)
*   **Trigger**: Slides containing lists, quotes, or paragraphs without images or code blocks.
*   **Result**: Traditional left-aligned slides with a neat top header line separating the title from content.
*   **Example**:
    ```markdown
    # Business Objectives
    - Scale active user base by 40% in Q3.
    - Launch live collaborative slide sync editing.
    - Integrate direct Figma exports.
    ```

---

## 📝 Adding Speaker Notes
Speaker notes appear in the Presenter View console and are excluded from the main presentation screen. Place them at the bottom of any slide block using either a `Note:` prefix or HTML comments:

```markdown
# Startup Pitch Deck
## Solving context loss in developer workspaces

Note: Start with high energy. Mention that context loss costs companies millions yearly.
```

---

## 💡 Best Practices for Premium Slides
1.  **Keep it Brief**: Avoid massive blocks of text. Limit lists to 3-5 bullet points to prevent text scaling down too small.
2.  **Highlight Code**: In code blocks, specify the language next to the backticks (e.g., ` ```typescript `) to show a premium tag in the card header.
3.  **High-Quality Images**: Use high-resolution Unsplash links for clean visuals.
4.  **Use Blockquotes**: Use blockquotes (`> text`) for client quotes or key stats to add editorial variety.
