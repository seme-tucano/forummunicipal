'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const users = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@fme.edu.br',
    role: 'ADMIN',
    active: true,
    lastLogin: '19 Jan 2026, 10:30',
    createdAt: '01 Jan 2024',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@fme.edu.br',
    role: 'EDITOR',
    active: true,
    lastLogin: '18 Jan 2026, 15:45',
    createdAt: '15 Mar 2024',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@fme.edu.br',
    role: 'REVIEWER',
    active: true,
    lastLogin: '17 Jan 2026, 09:20',
    createdAt: '20 Jun 2024',
  },
  {
    id: '4',
    name: 'Ana Pereira',
    email: 'ana.pereira@fme.edu.br',
    role: 'EDITOR',
    active: false,
    lastLogin: '10 Dez 2025, 14:00',
    createdAt: '05 Set 2024',
  },
]

const roleConfig: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  ADMIN: { label: 'Administrador', color: 'bg-red-100 text-red-700', icon: ShieldAlert },
  REVIEWER: { label: 'Revisor', color: 'bg-amber-100 text-amber-700', icon: ShieldCheck },
  EDITOR: { label: 'Editor', color: 'bg-blue-100 text-blue-700', icon: Shield },
}

export default function UsuariosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <AdminHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar usuários..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-500">Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-500">Administradores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-500">Editores</div>
            </CardContent>
          </Card>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Novo Usuário</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo *
                    </label>
                    <Input placeholder="Nome do usuário" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <Input type="email" placeholder="email@fme.edu.br" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perfil *
                    </label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Selecione...</option>
                      <option value="EDITOR">Editor - Criar e editar conteúdo próprio</option>
                      <option value="REVIEWER">Revisor - Revisar e aprovar conteúdo</option>
                      <option value="ADMIN">Administrador - Acesso total</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha temporária *
                    </label>
                    <Input type="password" placeholder="Senha inicial" />
                    <p className="text-xs text-gray-500 mt-1">
                      O usuário deverá alterar a senha no primeiro acesso.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Criar Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">Usuário</th>
                  <th className="text-left p-4 font-medium text-gray-600">Perfil</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Último acesso</th>
                  <th className="text-right p-4 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const role = roleConfig[user.role]
                  const RoleIcon = role.icon

                  return (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-700" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={role.color}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {role.label}
                        </Badge>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {user.active ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Ativo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400">
                            <XCircle className="h-4 w-4" />
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="p-4 hidden lg:table-cell text-gray-600">
                        {user.lastLogin}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={user.role === 'ADMIN'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Roles Legend */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Perfis de Acesso</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
                <div>
                  <p className="font-medium">Administrador</p>
                  <p className="text-gray-500">Acesso total ao sistema, incluindo gestão de usuários.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-medium">Revisor</p>
                  <p className="text-gray-500">Pode revisar, aprovar e publicar conteúdos.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-medium">Editor</p>
                  <p className="text-gray-500">Pode criar e editar seu próprio conteúdo.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
