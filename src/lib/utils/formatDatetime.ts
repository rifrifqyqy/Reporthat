export const formatTanggal = (isoString: string, locale = 'id-ID') => {
	const date = new Date(isoString);
	const options: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Asia/Jakarta'
	};
	const formatted = date.toLocaleString(locale, options);
	return formatted.replace('pukul ', ', ');
};
