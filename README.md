# AI Budget Modeler
![image](https://github.com/user-attachments/assets/1b8e39f6-085d-4f4d-8b96-6cdce851dc98)


A React-based web application designed to help model and visualize the distribution of AI tooling budget across different teams and people in an organization.

## Features

- **Scenario Builder**: Create and modify budget scenarios with tool assignments across teams
- **Budget Dashboard**: Visualize budget utilization with interactive charts and metrics
- **Tools Overview**: View all available tools with their pricing and constraints
- **Real-time Validation**: Get instant feedback on budget violations and constraints
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Budget Configuration

### Current Budget Structure
- **Monthly Budget**: $5,750 ($4,500 base + $1,250 premium buffer)
  - Engineering: $3,600 (60 people)
  - UX: $540 (9 people)
  - PM: $300 (5 people)
  - External: 10 additional seats available

### Constraints
- **Max cost per user**: $60/month
- **Experimental tools limit**: Maximum 3 tools
- **Users per experimental tool**: Maximum 5 users each

## Available Tools

### Approved Tools
- **GitHub Copilot Business**: $19/user/month
- **Claude Code**: $17/user/month
- **Cursor Team**: $40/user/month

### Experimental Tools
- **GitHub Copilot with Fine-tuning**: $60/user/month
- **Claude Code Max**: $100/user/month
- **Windsurf+Teams+SSO**: $40/user/month

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-budget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Budget Scenario

1. **Navigate to Scenario Builder**: Use the main navigation to access the scenario builder
2. **Add Tool Assignments**: 
   - Select a tool from the dropdown
   - Choose the target team
   - Specify the number of users
   - Click "Add" to add the assignment
3. **Review Warnings**: The system will automatically validate your scenario and show any constraint violations
4. **Modify Assignments**: Edit existing assignments by changing values directly in the assignment rows

### Viewing Budget Analysis

1. **Switch to Budget Dashboard**: Navigate to the dashboard tab
2. **Review Key Metrics**: View total cost, user count, average cost per user, and experimental tool usage
3. **Analyze Charts**: 
   - Team budget utilization bar chart
   - Cost distribution pie chart
4. **Detailed Breakdown**: Review the detailed table showing all assignments with costs and types

### Understanding Constraints

1. **Tools Overview**: Navigate to the tools tab to see all available tools
2. **Budget Constraints**: Review the budget limits and experimental tool constraints
3. **Tool Categories**: Understand the difference between approved and experimental tools

## Key Features Explained

### Real-time Budget Validation
- Automatically calculates total costs and budget utilization
- Warns when experimental tool limits are exceeded
- Alerts when individual user costs exceed the $60 limit
- Validates team assignment counts against team sizes

### Visual Analytics
- Interactive charts using Recharts library
- Responsive design with Tailwind CSS
- Color-coded status indicators for quick assessment

### Flexible Scenario Management
- Easy addition and removal of tool assignments
- Dynamic calculation of costs and constraints
- Editable scenario names for organization

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── BudgetDashboard.tsx
│   ├── ScenarioBuilder.tsx
│   └── ToolsOverview.tsx
├── utils/              # Utility functions
│   └── budgetCalculator.ts
├── types.ts            # TypeScript type definitions
├── data.ts             # Static data (tools, teams, constraints)
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Customization

### Adding New Tools
Edit `src/data.ts` and add new tools to the `TOOLS` array:

```typescript
{
  id: 'new-tool',
  name: 'New Tool Name',
  price: 25,
  type: 'approved', // or 'experimental'
  category: 'Tool Category'
}
```

### Modifying Team Structure
Update the `TEAMS` array in `src/data.ts`:

```typescript
{
  id: 'new-team',
  name: 'New Team',
  memberCount: 15,
  budgetAllocation: 750
}
```

### Adjusting Budget Constraints
Modify `BUDGET_CONSTRAINTS` in `src/data.ts`:

```typescript
export const BUDGET_CONSTRAINTS = {
  monthlyBudget: 4500,
  premiumBuffer: 1250,
  totalMonthlyBudget: 5750,
  maxUserCost: 60,
  maxExperimentalTools: 3,
  maxUsersPerExperimentalTool: 5
};
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
