import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

export async function GET() {
  try {
    const now = new Date()

    const [
      postsTotal,
      postsPublished,
      postsDraft,
      postsReview,
      documentsTotal,
      eventsTotal,
      eventsUpcoming,
      albumsTotal,
      imagesTotal,
      usersTotal,
      usersActive,
      contactMessagesUnread,
      recentPosts,
      recentDocuments,
    ] = await Promise.all([
      // Posts
      prisma.post.count(),
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.post.count({ where: { status: PostStatus.REVIEW } }),
      // Documents
      prisma.document.count(),
      // Events
      prisma.event.count(),
      prisma.event.count({ where: { startDate: { gte: now }, published: true } }),
      // Albums
      prisma.album.count(),
      prisma.galleryImage.count(),
      // Users
      prisma.user.count(),
      prisma.user.count({ where: { active: true } }),
      // Contact
      prisma.contactMessage.count({ where: { read: false } }),
      // Recent posts
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      // Recent documents
      prisma.document.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true,
          uploadedBy: { select: { name: true } },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts: {
          total: postsTotal,
          published: postsPublished,
          draft: postsDraft,
          review: postsReview,
        },
        documents: {
          total: documentsTotal,
        },
        events: {
          total: eventsTotal,
          upcoming: eventsUpcoming,
        },
        gallery: {
          albums: albumsTotal,
          images: imagesTotal,
        },
        users: {
          total: usersTotal,
          active: usersActive,
        },
        contact: {
          unread: contactMessagesUnread,
        },
        recent: {
          posts: recentPosts,
          documents: recentDocuments,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
