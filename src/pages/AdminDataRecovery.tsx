
import React from 'react'
import { DataRecoveryTool } from '@/components/admin/DataRecoveryTool'
import { AppLayout } from '@/components/layout/AppLayout'

export default function AdminDataRecovery() {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Administración de Datos</h1>
          <p className="text-muted-foreground">
            Herramientas para diagnosticar y recuperar datos de usuarios
          </p>
        </div>
        <DataRecoveryTool />
      </div>
    </AppLayout>
  )
}
