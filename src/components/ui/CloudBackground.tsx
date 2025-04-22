import { useEffect, useRef } from "react"

export function CloudBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const clouds: Cloud[] = []
        const cloudCount = 15

        // Create cloud objects
        for (let i = 0; i < cloudCount; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 30 + Math.random() * 40,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.1 + Math.random() * 0.2,
            })
        }

        function drawCloud(x: number, y: number, radius: number, opacity: number) {
            if (!ctx) return

            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.arc(x + radius * 0.5, y - radius * 0.4, radius * 0.7, 0, Math.PI * 2)
            ctx.arc(x - radius * 0.5, y - radius * 0.4, radius * 0.7, 0, Math.PI * 2)
            ctx.arc(x + radius * 0.9, y, radius * 0.6, 0, Math.PI * 2)
            ctx.arc(x - radius * 0.9, y, radius * 0.6, 0, Math.PI * 2)

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.fill()
        }

        function animate() {
            if (!ctx || !canvas) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            clouds.forEach((cloud) => {
                cloud.x += cloud.speed
                if (cloud.x > canvas.width + cloud.radius) {
                    cloud.x = -cloud.radius * 2
                    cloud.y = Math.random() * canvas.height
                }

                drawCloud(cloud.x, cloud.y, cloud.radius, cloud.opacity)
            })

            requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            if (!canvas) return
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-30" />
}

interface Cloud {
    x: number
    y: number
    radius: number
    speed: number
    opacity: number
}
