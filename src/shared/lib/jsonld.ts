export function buildBreadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildOrganization(settings: Record<string, string>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Бизнес-центр',
    address: settings.address ?? '',
    telephone: settings.phones ?? '',
    email: settings.email ?? '',
    openingHours: settings.workHours ?? '',
  }
}
