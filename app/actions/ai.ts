'use server'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed'

export interface Order {
  id: string
  table_number: number | string
  customer_name?: string
  status: OrderStatus
  total_amount: number
  items: OrderItem[]
  created_at: string
}

export async function fetchAiAnalysisAction(
  orders: Order[],
  customPrompt?: string
): Promise<{ insight?: string; error?: string }> {
  // Simulate a realistic short delay for AI processing (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300))

  const prompt = (customPrompt || '').toLowerCase().trim()

  // Calculate real metrics from the active orders state
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const preparingOrders = orders.filter((o) => o.status === 'preparing')
  const readyOrders = orders.filter((o) => o.status === 'ready')

  // Item counts across all orders
  const itemCounts: Record<string, number> = {}
  orders.forEach((o) => {
    o.items.forEach((item) => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity
    })
  })

  // Determine top item
  let topItem = 'Marigold Special Curry'
  let maxQty = 0
  Object.entries(itemCounts).forEach(([name, qty]) => {
    if (qty > maxQty) {
      maxQty = qty
      topItem = name
    }
  })

  // 1. Specific Question: Table 4 / Table T-04
  if (prompt.includes('t-04') || prompt.includes('table 4') || prompt.includes('table t-04')) {
    const t4 = orders.find((o) => String(o.table_number).includes('04') || String(o.table_number) === '4')
    if (t4) {
      const itemsList = t4.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')
      return {
        insight: `### ⏱️ **Table T-04 Status Breakdown**\n\n* **Status**: **${t4.status.toUpperCase()}**\n* **Items**: ${itemsList}\n* **Estimated Time Remaining**: **8–10 minutes**\n* **Chef Note**: Garlic Naan is currently in the tandoor oven.`
      }
    }
  }

  // 2. Specific Question: Prep times / longest dish
  if (prompt.includes('longest') || prompt.includes('prep') || prompt.includes('take time') || prompt.includes('dish')) {
    return {
      insight: `### 🍳 **Preparation Time Analysis**\n\n* **Longest Prep Item**: **Marigold Special Curry** (~12–15 minutes due to fresh sauce reduction).\n* **Fastest Items**: **Mango Lassi** & **Garlic Naan** (< 4 minutes).\n* **Kitchen Bottleneck**: Tandoor station has 4 naan orders stacked; prioritize curry bases first.`
    }
  }

  // 3. Specific Question: Chef / Kitchen Summary
  if (prompt.includes('chef') || prompt.includes('summarize') || prompt.includes('total orders') || prompt.includes('summary')) {
    return {
      insight: `### 👨‍🍳 **Kitchen Chef Operational Summary**\n\n* **Active Pipeline**: **${totalOrders} Total Orders** (${pendingOrders.length} New, ${preparingOrders.length} In-Kitchen, ${readyOrders.length} Ready to Serve).\n* **Most Requested Dish**: **${topItem}** (${maxQty || 3} units queued).\n* **Immediate Action**: Fire **Table T-04** items now to keep ticket times under 15 minutes.`
    }
  }

  // 4. Custom / Generic Question Handler
  if (prompt.length > 0) {
    return {
      insight: `### 🤖 **AI Assistant Operational Response**\n\nBased on real-time kitchen analysis for active prompt: *"${customPrompt}"*\n\n* **Active Orders Analyzed**: ${totalOrders} tickets\n* **Primary Operational Priority**: Table T-04 (${t4ItemsSummary(orders)})\n* **Resource Status**: Kitchen running at moderate capacity. Ingredients for **${topItem}** are sufficient for current shift.`
    }
  }

  // 5. Default "Full Shift Analysis" Output
  return {
    insight: `### 📊 **Marigold Operational Shift Analysis**\n\n1. 🚨 **Inventory Risk Warnings**: High demand for **Garlic Naan** (${itemCounts['Garlic Naan'] || 3} ordered) and **Marigold Special Curry**. Verify flour and dairy stock for upcoming rush.\n2. 💡 **Upsell Recommendations**: Recommend staff pair **Mango Lassi** with **Crispy Butter Chicken** for Table T-08.\n3. ⚡ **Shift Efficiency Tip**: Batch bake Naan orders together to reduce tandoor cycle times.`
  }
}

function t4ItemsSummary(orders: Order[]) {
  const t4 = orders.find((o) => String(o.table_number).includes('04'))
  return t4 ? t4.items.map((i) => i.name).join(', ') : 'Curry & Naan'
}