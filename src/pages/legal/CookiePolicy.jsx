import React from 'react'
import { useTranslation } from 'react-i18next'
import { LegalLayout } from '../../components/legal/LegalLayout'

const CookiePolicy = () => {
  const { t } = useTranslation()
  const content = t('legal.cookies', { returnObjects: true })

  return (
    <LegalLayout title={content.title} lastUpdated={content.lastUpdated}>
      <div className="space-y-10">
        {content.sections.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">{section.h}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {section.p}
            </p>
          </section>
        ))}
      </div>
    </LegalLayout>
  )
}

export default CookiePolicy
