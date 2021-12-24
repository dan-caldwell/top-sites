const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type Rank = {
    url: string;
    rank: number;
}

const RankItem: React.FC<Rank> = ({
    url,
    rank
}) => {
    return (
        <tr key={url} className="border-b leading-8 overflow-x-scroll">
            <td className="text-right border-r px-2">{numberWithCommas(rank)}</td>
            <td className="whitespace-nowrap lg:overflow-x-scroll overflow-x-hidden">
                <a className="text-blue-600 p-2" href={`https://${url}`} target="_blank" rel="noopener noreferrer">{url}</a>
            </td>
        </tr>
    )
}

export default RankItem;