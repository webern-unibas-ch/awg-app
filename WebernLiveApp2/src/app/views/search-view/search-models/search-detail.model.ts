import { SearchDetailHeaderForDisplay } from './search-detail-header.model';
import { SearchDetailPropsForDisplay } from './search-detail-props.model';
import { SearchDetailIncomingLinksForDisplay } from './search-detail-incoming-links.model';

export class SearchDetail {
    header: SearchDetailHeaderForDisplay;
    image: any[];
    props: SearchDetailPropsForDisplay[];
    incoming: SearchDetailIncomingLinksForDisplay[];
}
