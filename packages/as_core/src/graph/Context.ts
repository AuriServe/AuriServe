import Media from '../data/Media';
import Themes from '../data/Themes';
import Plugins from '../data/Plugins';

export default interface Context {
	media: Media;
	themes: Themes;
	plugins: Plugins;
}
