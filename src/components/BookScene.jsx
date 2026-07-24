'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const booksData = [
  { title: 'Ordo Salutis', color: '#111827', x: -2.25, rotation: 0.45 },
  { title: 'Pray Like Paul', color: '#F7D96D', x: 0, rotation: 0 },
  { title: 'The Rapture', color: '#191919', x: 2.25, rotation: -0.45 },
]

function createCoverTexture(title, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 1080
  const context = canvas.getContext('2d')

  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  context.lineWidth = 3
  context.strokeRect(48, 48, canvas.width - 96, canvas.height - 96)

  context.fillStyle = color === '#F7D96D' ? '#0A0E1A' : '#F4F1E9'
  context.textAlign = 'center'
  context.font = '500 72px Georgia, serif'

  const words = title.split(' ')
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ')
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ')
  context.fillText(firstLine, canvas.width / 2, 510)
  if (secondLine) context.fillText(secondLine, canvas.width / 2, 600)

  context.font = '600 22px Arial, sans-serif'
  context.fillText('TGN AFRICA', canvas.width / 2, 975)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function BookScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.15, 7)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.35))
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4)
    directionalLight.position.set(4, 5, 6)
    scene.add(directionalLight)

    const group = new THREE.Group()
    scene.add(group)

    const books = booksData.map((data) => {
      const geometry = new THREE.BoxGeometry(1.65, 2.55, 0.34)
      const texture = createCoverTexture(data.title, data.color)
      const paper = new THREE.MeshPhongMaterial({ color: '#eee8dc' })
      const cover = new THREE.MeshPhongMaterial({ color: data.color })
      const front = new THREE.MeshPhongMaterial({ map: texture })
      const materials = [paper, cover, paper, paper, front, cover]
      const book = new THREE.Mesh(geometry, materials)
      book.position.x = data.x
      book.rotation.y = data.rotation
      book.userData = { ...data, texture }
      group.add(book)
      return book
    })

    let frameId
    let targetOffset = 0
    let currentOffset = 0
    let dragStartX = 0
    let dragStartOffset = 0
    let targetTilt = 0
    let currentTilt = 0
    let isDragging = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loopWidth = 6.75
    const autoSpeed = 0.00012
    let lastTime = performance.now()

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const handlePointerDown = (event) => {
      isDragging = true
      dragStartX = event.clientX
      dragStartOffset = targetOffset
      container.setPointerCapture(event.pointerId)
      container.classList.add('cursor-grabbing')
    }

    const handlePointerMove = (event) => {
      const bounds = container.getBoundingClientRect()
      const normalized = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      if (event.buttons === 1 || event.pointerType === 'touch') {
        const delta = (event.clientX - dragStartX) / bounds.width
        targetOffset = dragStartOffset - delta * loopWidth
      } else {
        targetTilt = normalized
      }
    }

    const handlePointerUp = (event) => {
      isDragging = false
      container.releasePointerCapture(event.pointerId)
      container.classList.remove('cursor-grabbing')
    }

    const handlePointerLeave = () => {
      targetTilt = 0
    }

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return
      event.preventDefault()
      targetOffset += event.deltaX * 0.002 * loopWidth
    }

    const animate = (time) => {
      const delta = time - lastTime
      lastTime = time
      if (!isDragging) {
        targetOffset += autoSpeed * delta
      }
      currentOffset += (targetOffset - currentOffset) * 0.08
      currentTilt += (targetTilt - currentTilt) * 0.08

      books.forEach((book, index) => {
        const base = book.userData
        let x = base.x + currentOffset
        x = THREE.MathUtils.euclideanModulo(x + loopWidth / 2, loopWidth) - loopWidth / 2
        const distance = Math.abs(x)
        const emphasis = Math.max(0, 1 - distance / 3.3)
        const scale = 1 + emphasis * 0.18
        book.position.x = x
        book.scale.setScalar(scale)
        book.rotation.y = base.rotation + currentTilt * 0.18 + currentOffset * 0.22
        book.position.z = emphasis * 0.55
        if (!reducedMotion) book.position.y = Math.sin(time * 0.0007 + index) * 0.045
      })
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointerleave', handlePointerLeave)
    container.addEventListener('wheel', handleWheel, { passive: false })
    resize()
    animate(lastTime)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      books.forEach((book) => {
        book.geometry.dispose()
        book.material.forEach((material) => material.dispose())
        book.userData.texture.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="book-canvas h-[430px] w-full md:h-[600px]" aria-label="Interactive three-dimensional book series" />
}
