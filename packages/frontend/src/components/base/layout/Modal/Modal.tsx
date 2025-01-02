import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react'
import { FadeInOut } from '../../Animations/FadeInOut'
import { Button } from '../../Button/Button'
import { cn } from '../../../../utils/cn'
import { styles } from './styles'

type ModalWidth = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  showCloseButton?: boolean
  maxWidth?: ModalWidth
  minWidth?: ModalWidth
  className?: string
}

const widthClasses: Record<ModalWidth, { min: string; max: string }> = {
  sm: {
    min: 'min-w-[24rem]',
    max: 'max-w-sm'
  },
  md: {
    min: 'min-w-[28rem]',
    max: 'max-w-md'
  },
  lg: {
    min: 'min-w-[32rem]',
    max: 'max-w-lg'
  },
  xl: {
    min: 'min-w-[36rem]',
    max: 'max-w-xl'
  }
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxWidth = 'xl',
  minWidth = 'lg',
  className
}: ModalProps) {
  return (
    <FadeInOut show={isOpen}>
      <Dialog
        as="div"
        className={styles.container}
        onClose={onClose}
        open={isOpen}
      >
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.container}>
          <div className="flex min-h-full items-center justify-center">
            <FadeInOut show={isOpen} direction="down">
              <Dialog.Panel 
                className={cn(
                  styles.content,
                  widthClasses[minWidth].min,
                  widthClasses[maxWidth].max,
                  className
                )}
              >
                {showCloseButton && (
                  <div className="absolute right-4 top-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      className="p-2"
                      aria-label="Close"
                      iconOnly
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {title && (
                  <div className={styles.header}>
                    {title}
                  </div>
                )}

                <div className={styles.body}>
                  {children}
                </div>
              </Dialog.Panel>
            </FadeInOut>
          </div>
        </div>
      </Dialog>
    </FadeInOut>
  )
} 