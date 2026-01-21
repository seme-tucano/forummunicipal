import prisma from './prisma'
import { getRequestInfo } from './api-auth'

interface AuditLogData {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'DOWNLOAD'
  entity: string
  entityId?: string
  userId?: string
  details?: Record<string, unknown>
}

/**
 * Registra uma ação no log de auditoria
 */
export async function logAudit(data: AuditLogData) {
  try {
    const { ip, userAgent } = await getRequestInfo()

    await prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        userId: data.userId,
        details: data.details as object,
        ip,
        userAgent,
      },
    })
  } catch (error) {
    // Não falhar a operação principal se o log falhar
    console.error('Erro ao criar log de auditoria:', error)
  }
}

/**
 * Log de criação de recurso
 */
export async function logCreate(
  entity: string,
  entityId: string,
  userId: string,
  details?: Record<string, unknown>
) {
  return logAudit({
    action: 'CREATE',
    entity,
    entityId,
    userId,
    details,
  })
}

/**
 * Log de atualização de recurso
 */
export async function logUpdate(
  entity: string,
  entityId: string,
  userId: string,
  details?: Record<string, unknown>
) {
  return logAudit({
    action: 'UPDATE',
    entity,
    entityId,
    userId,
    details,
  })
}

/**
 * Log de exclusão de recurso
 */
export async function logDelete(
  entity: string,
  entityId: string,
  userId: string,
  details?: Record<string, unknown>
) {
  return logAudit({
    action: 'DELETE',
    entity,
    entityId,
    userId,
    details,
  })
}

/**
 * Log de login
 */
export async function logLogin(userId: string, email: string) {
  return logAudit({
    action: 'LOGIN',
    entity: 'User',
    entityId: userId,
    userId,
    details: { email },
  })
}

/**
 * Log de logout
 */
export async function logLogout(userId: string) {
  return logAudit({
    action: 'LOGOUT',
    entity: 'User',
    entityId: userId,
    userId,
  })
}

/**
 * Log de download de documento
 */
export async function logDownload(
  documentId: string,
  userId?: string,
  details?: Record<string, unknown>
) {
  return logAudit({
    action: 'DOWNLOAD',
    entity: 'Document',
    entityId: documentId,
    userId,
    details,
  })
}
