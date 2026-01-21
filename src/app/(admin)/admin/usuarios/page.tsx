'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  createdAt: string
  updatedAt: string
  postsCount: number
  documentsCount: number
}

const roleConfig: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  ADMIN: { label: 'Administrador', color: 'bg-red-100 text-red-700', icon: ShieldAlert },
  REVIEWER: { label: 'Revisor', color: 'bg-amber-100 text-amber-700', icon: ShieldCheck },
  EDITOR: { label: 'Editor', color: 'bg-blue-100 text-blue-700', icon: Shield },
}

export default function UsuariosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR',
    active: true,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'EDITOR',
      active: true,
    })
    setEditingUser(null)
  }

  function openCreateModal() {
    resetForm()
    setShowCreateModal(true)
  }

  function openEditModal(user: UserData) {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      active: user.active,
    })
    setEditingUser(user)
    setShowEditModal(true)
  }

  async function handleCreate() {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowCreateModal(false)
        resetForm()
        fetchUsers()
      } else {
        alert(data.error || 'Erro ao criar usuário')
      }
    } catch (error) {
      console.error('Erro ao criar:', error)
      alert('Erro ao criar usuário')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate() {
    if (!editingUser) return

    setSaving(true)

    const payload: Record<string, unknown> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      active: formData.active,
    }

    if (formData.password) {
      payload.password = formData.password
    }

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setShowEditModal(false)
        resetForm()
        fetchUsers()
      } else {
        alert(data.error || 'Erro ao atualizar usuário')
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      alert('Erro ao atualizar usuário')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.ok) {
        setUsers(users.filter(u => u.id !== id))
      } else {
        alert(data.error || 'Erro ao excluir usuário')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  async function toggleActive(user: UserData) {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !user.active }),
      })

      const data = await res.json()

      if (res.ok) {
        setUsers(users.map(u =>
          u.id === user.id ? { ...u, active: !u.active } : u
        ))
      } else {
        alert(data.error || 'Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    editors: users.filter(u => u.role === 'EDITOR').length,
  }

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
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-500">Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
              <div className="text-sm text-gray-500">Administradores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.editors}</div>
              <div className="text-sm text-gray-500">Editores</div>
            </CardContent>
          </Card>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Novo Usuário</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo *
                    </label>
                    <Input
                      placeholder="Nome do usuário"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <Input
                      type="email"
                      placeholder="email@fme.edu.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perfil *
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="EDITOR">Editor - Criar e editar conteúdo próprio</option>
                      <option value="REVIEWER">Revisor - Revisar e aprovar conteúdo</option>
                      <option value="ADMIN">Administrador - Acesso total</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha temporária *
                    </label>
                    <Input
                      type="password"
                      placeholder="Senha inicial"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O usuário deverá alterar a senha no primeiro acesso.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Editar Usuário</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo *
                    </label>
                    <Input
                      placeholder="Nome do usuário"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <Input
                      type="email"
                      placeholder="email@fme.edu.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perfil *
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="EDITOR">Editor - Criar e editar conteúdo próprio</option>
                      <option value="REVIEWER">Revisor - Revisar e aprovar conteúdo</option>
                      <option value="ADMIN">Administrador - Acesso total</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nova senha (deixe em branco para manter)
                    </label>
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="active"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <label htmlFor="active" className="text-sm text-gray-700">
                      Usuário ativo
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Table */}
        <Card>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
              <p className="text-gray-500 mt-2">Carregando usuários...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-600">Usuário</th>
                    <th className="text-left p-4 font-medium text-gray-600">Perfil</th>
                    <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Criado em</th>
                    <th className="text-right p-4 font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const role = roleConfig[user.role] || roleConfig.EDITOR
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
                            <button
                              onClick={() => toggleActive(user)}
                              className="cursor-pointer"
                              title={user.active ? 'Clique para desativar' : 'Clique para ativar'}
                            >
                              {user.active ? (
                                <span className="flex items-center gap-1 text-green-600 hover:text-green-700">
                                  <CheckCircle className="h-4 w-4" />
                                  Ativo
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-gray-400 hover:text-gray-500">
                                  <XCircle className="h-4 w-4" />
                                  Inativo
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-4 hidden lg:table-cell text-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(user)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(user.id)}
                                disabled={user.role === 'ADMIN'}
                                title={user.role === 'ADMIN' ? 'Não é possível excluir administradores' : 'Excluir usuário'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
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
