const GOAL_SYMBOL_MAP: Record<string, string> = {
  globe: 'beach_access',
  heart: 'child_hat',
  hourglass: 'schedule',
  home: 'home',
  gauge: 'directions_car',
  'credit-card': 'shopping_cart',
  'piggy-bank': 'savings',
  'pen-tool': 'edit',
}

export function resolveGoalSymbol(iconName?: string): string {
  if (!iconName) {
    return 'flag'
  }

  return GOAL_SYMBOL_MAP[iconName] ?? 'flag'
}
