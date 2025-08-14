"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react"
import { seitraceAddr } from "@/lib/sei"

interface WalletInputProps {
  onAddWallet: (address: string) => void
  placeholder?: string
  className?: string
}

export function WalletInput({
  onAddWallet,
  placeholder = "Enter wallet address (0x...)",
  className = "",
}: WalletInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    message: string
    type: "success" | "error" | "warning"
  } | null>(null)

  const validateAddress = (address: string) => {
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/

    if (!address) {
      return { isValid: false, message: "Please enter a wallet address", type: "error" as const }
    }

    if (!ethAddressRegex.test(address)) {
      return { isValid: false, message: "Invalid Ethereum address format", type: "error" as const }
    }

    return { isValid: true, message: "Valid Sei EVM address", type: "success" as const }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)

    if (value.length > 10) {
      const validation = validateAddress(value)
      setValidationResult(validation)
    } else {
      setValidationResult(null)
    }
  }

  const handleAddWallet = async () => {
    const validation = validateAddress(inputValue)

    if (!validation.isValid) {
      setValidationResult(validation)
      return
    }

    setIsValidating(true)

    try {
      // Add wallet to watchlist
      onAddWallet(inputValue)
      setInputValue("")
      setValidationResult({ isValid: true, message: "Wallet added to watchlist", type: "success" })

      // Clear success message after 3 seconds
      setTimeout(() => setValidationResult(null), 3000)
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: "Failed to add wallet",
        type: "error",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddWallet()
    }
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
              />
            </div>
            <Button
              onClick={handleAddWallet}
              disabled={!validationResult?.isValid || isValidating}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isValidating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
            {inputValue && validationResult?.isValid && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-emerald-500"
                onClick={() => window.open(seitraceAddr(inputValue), "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {validationResult && (
            <div className="flex items-center space-x-2">
              {validationResult.type === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {validationResult.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
              {validationResult.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}

              <Badge
                variant="outline"
                className={
                  validationResult.type === "success"
                    ? "border-green-500 text-green-500"
                    : validationResult.type === "error"
                      ? "border-red-500 text-red-500"
                      : "border-yellow-500 text-yellow-500"
                }
              >
                {validationResult.message}
              </Badge>
            </div>
          )}

          <div className="text-xs text-slate-400">
            Enter any Sei EVM address to add to your watchlist • All addresses link to Seitrace for verification
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
