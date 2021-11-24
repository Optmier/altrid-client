import ProblemCategories from '../components/TOFELEditor/ProblemCategories';
import CSATCategories from '../components/TOFELEditor/CSATCategories';

export default function CategorySelector(subject) {
    switch (subject) {
        case 0:
            return CSATCategories;
        case 1:
            return ProblemCategories;
        default:
            return ProblemCategories;
    }
}
