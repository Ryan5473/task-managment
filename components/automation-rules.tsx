"use client"

import { useState } from "react"
import { Plus, Trash2, Settings, Zap, ArrowRight, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Rule, Column } from "@/types/kanban"
import { generateId } from "@/lib/utils"

interface AutomationRulesProps {
  rules: Rule[]
  columns: Column[]
  onAddRule: (rule: Rule) => void
  onUpdateRule: (ruleId: string, updates: Partial<Rule>) => void
  onDeleteRule: (ruleId: string) => void
}

export default function AutomationRules({
  rules,
  columns,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
}: AutomationRulesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newRule, setNewRule] = useState<Rule>({
    id: `rule-${generateId()}`,
    name: "",
    condition: {
      type: "due-date",
      operator: "is-overdue",
    },
    action: {
      type: "move-to-column",
      targetColumnId: columns[0]?.id || "",
    },
    enabled: true,
  })

  const handleAddRule = () => {
    if (!newRule.name.trim()) return

    onAddRule(newRule)
    setNewRule({
      id: `rule-${generateId()}`,
      name: "",
      condition: {
        type: "due-date",
        operator: "is-overdue",
      },
      action: {
        type: "move-to-column",
        targetColumnId: columns[0]?.id || "",
      },
      enabled: true,
    })
    setIsOpen(false)
  }

  const toggleRuleEnabled = (ruleId: string, enabled: boolean) => {
    onUpdateRule(ruleId, { enabled })
  }

  const getConditionDescription = (rule: Rule) => {
    switch (rule.condition.type) {
      case "due-date":
        return "When task is overdue"
      case "subtasks-completed":
        return "When all subtasks are completed"
      case "custom-field":
        return `When ${rule.condition.field} ${rule.condition.operator} ${rule.condition.value}`
      default:
        return "Unknown condition"
    }
  }

  return (
    <div className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Automation Rules</h3>
            <p className="text-sm text-muted-foreground">
              Automate your workflow with custom rules
            </p>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Create Automation Rule
              </DialogTitle>
              <DialogDescription>
                Create a rule to automatically move tasks based on specific conditions.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* Rule Name */}
              <div className="space-y-3">
                <Label htmlFor="rule-name" className="text-sm font-medium">
                  Rule Name
                </Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., Move overdue tasks to Blocked"
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Condition Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-blue-500" />
                  <Label className="text-base font-medium">When (Condition)</Label>
                </div>
                
                <div className="pl-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Condition Type</Label>
                    <Select
                      value={newRule.condition.type}
                      onValueChange={(value: "due-date" | "subtasks-completed" | "custom-field") =>
                        setNewRule({
                          ...newRule,
                          condition: {
                            ...newRule.condition,
                            type: value,
                            operator:
                              value === "due-date"
                                ? "is-overdue"
                                : value === "subtasks-completed"
                                  ? "all-completed"
                                  : "equals",
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due-date">Due Date</SelectItem>
                        <SelectItem value="subtasks-completed">Subtasks</SelectItem>
                        <SelectItem value="custom-field">Custom Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newRule.condition.type === "due-date" && (
                    <div className="space-y-2">
                      <Label className="text-sm">Operator</Label>
                      <Select
                        value={newRule.condition.operator}
                        onValueChange={(value: "is-overdue") =>
                          setNewRule({
                            ...newRule,
                            condition: { ...newRule.condition, operator: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="is-overdue">Is Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {newRule.condition.type === "subtasks-completed" && (
                    <div className="space-y-2">
                      <Label className="text-sm">Operator</Label>
                      <Select
                        value={newRule.condition.operator}
                        onValueChange={(value: "all-completed") =>
                          setNewRule({
                            ...newRule,
                            condition: { ...newRule.condition, operator: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-completed">All Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {newRule.condition.type === "custom-field" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Field Name</Label>
                        <Input
                          placeholder="Field name"
                          value={newRule.condition.field || ""}
                          onChange={(e) =>
                            setNewRule({
                              ...newRule,
                              condition: { ...newRule.condition, field: e.target.value },
                            })
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Operator</Label>
                        <Select
                          value={newRule.condition.operator}
                          onValueChange={(value: "equals" | "not-equals" | "contains") =>
                            setNewRule({
                              ...newRule,
                              condition: { ...newRule.condition, operator: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="not-equals">Not Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Value</Label>
                        <Input
                          placeholder="Value"
                          value={newRule.condition.value || ""}
                          onChange={(e) =>
                            setNewRule({
                              ...newRule,
                              condition: { ...newRule.condition, value: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Action Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <Label className="text-base font-medium">Then (Action)</Label>
                </div>
                
                <div className="pl-6 space-y-2">
                  <Label className="text-sm">Move to Column</Label>
                  <Select
                    value={newRule.action.targetColumnId}
                    onValueChange={(value) =>
                      setNewRule({
                        ...newRule,
                        action: { ...newRule.action, targetColumnId: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target column" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRule} disabled={!newRule.name.trim()}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Zap className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">No automation rules yet</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Create automation rules to streamline your workflow and automatically move tasks based on conditions.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 bg-card rounded-lg border transition-all duration-200 ${
                rule.enabled 
                  ? "border-border shadow-sm hover:shadow-md" 
                  : "border-border/50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-card-foreground">{rule.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.enabled 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {rule.enabled ? "Active" : "Inactive"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{getConditionDescription(rule)}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Move to {columns.find((col) => col.id === rule.action.targetColumnId)?.title}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => toggleRuleEnabled(rule.id, checked)}
                    aria-label={rule.enabled ? "Disable rule" : "Enable rule"}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => onDeleteRule(rule.id)}
                    aria-label="Delete rule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
