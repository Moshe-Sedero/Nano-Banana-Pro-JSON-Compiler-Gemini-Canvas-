# **Nano Banana Pro JSON Compiler (Gemini Canvas)**

A specialized React-based tool designed to generate, validate, and manage complex JSON prompts for the "Nano Banana Pro" image generation model. This tool focuses on structured prompt engineering, ensuring consistency and logic across various parameters like subject details, camera settings, lighting, and apparel.

## **🚀 Key Features**

* **Schema-Driven UI:** Dynamic form generation based on a strict configuration schema.  
* **Smart Randomization:** Intelligently randomizes parameters while respecting locked fields and photography logic (e.g., matching lens focal length to shot type).  
* **Constraint Engine:**  
  * **Hard Constraints:** Enforces logical consistency (e.g., "Mirror Selfie" requires "Smartphone").  
  * **Soft Steering:** Guides randomization towards aesthetic combinations without overriding user locks.  
  * **Conflict Resolution:** Visual badges and tooltips indicate when and why a specific field was auto-corrected or if a constraint is blocked by a lock.  
* **Multi-JSON Batching:** Generate sequences of prompts in a single session for batch processing.  
* **Multi-Panel Mode:** Option to append instructions and global aspect ratio settings for creating multi-panel collages from the generated batch.  
* **State Management:**  
  * **Granular Locking:** Lock specific fields to prevent them from changing during randomization or resets.  
  * **Undo/Redo:** Built-in history tracking for safe experimentation.  
  * **Import:** Parse and normalize existing JSON prompts, mapping legacy aliases to the current schema.

## **🛠 Technical Architecture**

The application is currently structured as a **Single-File Component (App.jsx)** to facilitate easy portability within specific coding environments (Gemini Canvas).

### **Core Components**

1. **SCHEMA**: A declarative object defining all fields, data types (select, multi\_select, boolean, text), options, and default values.  
2. **CONSTRAINTS**: Defines rules for compatibility (e.g., Scene vs. Apparel) and strict logic dependencies.  
3. **usePromptEngine (Custom Hook)**: The "brain" of the application. It handles state synchronization, the constraint validation pipeline (validateAndFix), randomization logic, and history (Undo) management.

## **📦 Installation & Usage**

While this is a single-file app, it requires a standard React environment to run.

### **Prerequisites**

* Node.js (v16+)  
* npm or yarn

### **Setup**

1. Create a new Vite project:  
   **npm create vite@latest nano-banana-compiler \-- \--template react**  
   **cd nano-banana-compiler**

2. Install dependencies:  
   **npm install lucide-react**

   *Note: Tailwind CSS is required for styling. Follow the [Tailwind CSS Vite Guide](https://tailwindcss.com/docs/guides/vite) to configure it.*  
3. Replace the contents of src/App.jsx with the code from this repository.  
4. Run the development server:  
   **npm run dev**

## **📝 Configuration**

To modify the available options (e.g., adding a new camera type or changing apparel options), edit the SCHEMA constant at the top of App.jsx.

To modify logic rules (e.g., preventing "Swimwear" in an "Office" setting), edit the CONSTRAINTS constant.

## **🤝 Contributing**

1. Fork the repository.  
2. Create your feature branch (git checkout \-b feature/AmazingFeature).  
3. Commit your changes (git commit \-m 'Add some AmazingFeature').  
4. Push to the branch (git push origin feature/AmazingFeature).  
5. Open a Pull Request.

## **📄 License**

Distributed under the MIT License.

---
Testing Ruleset
