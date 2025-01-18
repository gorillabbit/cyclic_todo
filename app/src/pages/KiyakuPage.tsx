import { Box, Typography } from "@mui/material";

const KiyakuPage = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box mb={2}>
        <Typography variant="h5">利用規約 </Typography>
      </Box>
      <Typography paragraph>
        本規約は、gorillabbit（以下「当社」といいます。）が提供する「cyclic_todo」（以下「本サービス」といいます。）を利用される際に適用されます。ご利用にあたっては、本規約をお読みいただき、内容をご承諾の上でご利用ください。
      </Typography>

      <Box mb={2}>
        <Typography variant="h6">第1条 （規約の適用）</Typography>
        <Typography paragraph>
          1
          本規約は、当社が本サービスを提供する上で、利用者が本サービスの提供を受けるにあたっての諸条件を定めたものです。
        </Typography>
        <Typography paragraph>
          2
          当社は、本サービスの提供に関して、本規約のほか、本サービスの利用に関する個別規約その他のガイドライン等を定めることがあります。この場合、当該個別規約その他のガイドライン等は、本規約の一部として利用者による本サービスの利用に優先して適用されるものとします。
        </Typography>
        <Typography paragraph>
          3
          利用者が本サービスを利用された場合、利用者が本規約に同意したものとみなします。
        </Typography>
        <Typography paragraph>
          4
          利用者が、未成年の場合、利用者は、本サービスの利用について、親権者等法定代理人の同意を得なければなりません。当社は、未成年者の利用者による本サービスの利用については、親権者等法定代理人の同意を得て行為されたものとみなします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第2条 （利用登録）</Typography>
        <Typography paragraph>
          1
          利用者は、当社が定める方法により必要事項を登録いただくことで、利用登録を行うことができます。
        </Typography>
        <Typography paragraph>
          2
          利用者は、登録事項について、当社に対して正確かつ最新の情報を届け出なければなりません。
        </Typography>
        <Typography paragraph>
          3
          登録内容に変更が生じた場合、利用者は、速やかに、変更内容を当社に届け出るものとします。
        </Typography>
        <Typography paragraph>
          4
          登録内容が不正確若しくは虚偽であり、又は、変更内容について届出がされていないために、利用者が損害又は不利益を被ったとしても、当社は責任を負わないものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第3条 （ID及びパスワードの管理）</Typography>
        <Typography paragraph>
          1 利用者が利用登録を行った場合、当社はID及びパスワードを発行します。
        </Typography>
        <Typography paragraph>
          2
          利用者は、ID及びパスワードを厳重に管理し、保管するものとし、これを第三者に貸与、譲渡、売買その他の方法をもって利用させてはならないものとします。ID又はパスワードの管理が不十分なことにより、利用者が損害又は不利益を被ったとしても、当社は責任を負わないものとします。
        </Typography>
        <Typography paragraph>
          3
          ID又はパスワードを紛失又は忘失した場合、又はこれらが第三者に使用されていることが判明した場合、利用者は、直ちにその旨を当社に通知するものとします。
        </Typography>
        <Typography paragraph>
          4
          当社は、利用者に発行したID及びパスワードによる本サービスの利用の一切について、利用者による真正な利用か否かにかかわらず、利用者本人の行為とみなすものとし、利用者は当該行為の結果生じる一切の責任を負担するものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第4条 （商品等の購入又は利用）</Typography>
        <Typography paragraph>
          1
          利用者は、本サービスにより提供される商品、デジタルコンテンツ又は役務（以下「商品等」といいます。）を購入又は利用しようとする場合、当社が指定する方法に従って、商品等の購入又は利用の申込みを行うものとします。
        </Typography>
        <Typography paragraph>
          2
          前項の申込みにあたり、利用者が入力した事項及び申込内容を確認の上、申込みを確定するボタンをクリックし、当社が申込みを受信した時をもって、当社との間で当該商品等の購入又は利用に係る契約が成立するものとします。
        </Typography>
        <Typography paragraph>
          3
          本条の規定に拘わらず、本サービスの利用に関して本規約の違反があった場合、当社は、売買契約の解除、損害賠償請求その他当社が適当と考える措置を講じることができるものとします。当該措置によって利用者が被った損害又は不利益については、当社の故意又は重過失による場合を除いて、当社は一切の責任を負いません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第5条 （支払方法）</Typography>
        <Typography paragraph>
          1
          利用者は、前条の商品等の購入手続において表示される商品等の代金を支払うものとします。
        </Typography>
        <Typography paragraph>
          2
          商品等の代金の支払方法は、購入手続において案内される方法又は当社が別途認める支払方法とします。
        </Typography>
        <Typography paragraph>
          3
          クレジットカードによる支払の場合、利用者は、利用者がクレジットカード会社との間で別途契約する条件に従うものとします。クレジットカードの利用に関連して、利用者とクレジットカード会社との間で何らかの紛争が発生した場合、利用者は、自己の責任と費用において、当該紛争を解決するものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第6条 （コンテンツの利用）</Typography>
        <Typography paragraph>
          申込みの対象がデジタルコンテンツの場合、当該デジタルコンテンツの利用に係る契約の成立後、当該デジタルコンテンツは利用可能となります。ダウンロードされたものの紛失、破壊又は損傷は利用者の責任となります。疑義を避けるために付言すると、デジタルコンテンツに係る著作権等の知的財産権が利用者に譲渡されるものではありません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第7条 （商品等の返品・交換）</Typography>
        <Typography paragraph>
          1
          本サービスに関し、商品等の返品及び交換は、以下の場合を除き、受け付けておりません。
        </Typography>
        <Typography paragraph>
          (1)
          商品等の欠陥や不良による場合。この場合、商品等の到着後8日間以内に、当社の指定する方法により、当社に通知することで行うものとします。
        </Typography>
        <Typography paragraph>
          (2)
          その他当社が独自に定める場合。この場合、当社のウェブサイト等で案内する方法によるものとします。
        </Typography>
        <Typography paragraph>
          2
          未成年の利用者による購入についても、親権者等法定代理人の同意のもと購入したものとみなされますので、商品等の返品及び交換は受け付けておりません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第8条 （商品等に関する免責）</Typography>
        <Typography paragraph>
          1
          本サービスを通じて販売される商品等の品質、機能、性能、他の物品との適合性その他の欠陥に関する当社の責任は、当社の故意又は重過失による場合を除いて、前条に定めるものに限られるものとします。
        </Typography>
        <Typography paragraph>
          2
          当社は、本サービスのウェブサイト上の表示及び利用者が投稿した商品等に関する写真及びコメント並びにTwitter、Instagramその他のSNSサービスに投稿したコメントについて、適法性、有用性、完全性、正確性、最新性、信頼性、特定目的への適合性を含め何らの保証をしません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第9条 （知的財産権及びコンテンツ）</Typography>
        <Typography paragraph>
          本サービスを構成する全ての素材に関する著作権を含む知的財産権その他の一切の権利は、当社又は当該権利を有する第三者に帰属しています。利用者は、本サービスの全ての素材に関して、一切の権利を取得することはないものとし、権利者の許可なく、素材に関する権利を侵害する一切の行為をしてはならないものとします。本規約に基づく本サービスの利用の許諾は、本サービスに関する当社又は当該権利を有する第三者の権利の使用許諾を意味するものではありません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第10条 （利用者による投稿）</Typography>
        <Typography paragraph>
          1
          本サービス内における利用者による書き込み、レビュー、コメント等の情報及び利用者が掲載、アップロード又は閲覧可能にした画像、イラストその他のコンテンツ（以下「利用者投稿情報」といいます。）は、本サービスの不特定多数の利用者からアクセス及び閲覧されることを十分に理解の上、本サービスをご利用ください。利用者投稿情報については、これを行った利用者が一切の責任を負うものとします。
        </Typography>
        <Typography paragraph>
          2 利用者は以下の情報の投稿を行うことはできません。
        </Typography>
        <Typography paragraph>(1) 真実ではないもの</Typography>
        <Typography paragraph>
          (2) わいせつな表現又はヌード等のわいせつ画像を含むもの
        </Typography>
        <Typography paragraph>(3) 他人の名誉又は信用を傷つけるもの</Typography>
        <Typography paragraph>
          (4) 第三者のプライバシー権、肖像権、著作権その他の権利を侵害するもの
        </Typography>
        <Typography paragraph>(5) コンピュータウィルスを含むもの</Typography>
        <Typography paragraph>
          (6) 当社の認めるウェブサイト以外のウェブサイトへのリンクやURL
        </Typography>
        <Typography paragraph>(7) その他当社が不適当と判断するもの</Typography>
        <Typography paragraph>
          3
          利用者は、当社が利用者投稿情報を無償で使用することを許諾するものとします。許諾にあたり、利用者は以下を表明し保証するものとします。
        </Typography>
        <Typography paragraph>
          (1)
          利用者投稿情報に関する著作権、著作隣接権、肖像権その他一切の権利について、正当な権利者であり、又は、正当な権利者から本サービスに係る利用者投稿情報の利用に必要な一切の許諾を受けていること。
        </Typography>
        <Typography paragraph>
          (2)
          利用者投稿情報の投稿及び当社による利用が、第三者の著作権、著作隣接権、肖像権その他一切の権利を侵害しないこと。
        </Typography>
        <Typography paragraph>
          4
          当社は、利用者に安全に本サービスを利用いただくことを目的として、利用者投稿情報の内容を監視することができるものとします。
        </Typography>
        <Typography paragraph>
          5
          当社は、利用者投稿情報が本規約に違反する場合又は以下の事由に該当する場合、利用者への事前の通知なく利用者投稿情報を削除すること及び利用者の投稿の制限を行うことができるものとします。
        </Typography>
        <Typography paragraph>(1) 投稿から一定期間以上経過した場合</Typography>
        <Typography paragraph>
          (2) 本サービスの保守管理上、必要と認められる場合
        </Typography>
        <Typography paragraph>
          (3)
          利用者投稿情報等の容量が当社の使用機器の所定容量を超過した場合又はその恐れが生じた場合
        </Typography>
        <Typography paragraph>
          6
          当社は、前項による削除及び投稿の制限の理由につき、利用者に対し返答する義務を負うものではなく、削除及び制限につき、利用者に発生した損害又は不利益について責任を負いません。また、当社は、利用者投稿情報の削除義務を負うものではありません。
        </Typography>
        <Typography paragraph>
          7
          利用者は、本条に係る利用者投稿情報の監視、削除及び投稿の制限について、あらかじめ同意するものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">
          第11条 （サービスの内容の変更、追加、停止）
        </Typography>
        <Typography paragraph>
          当社は、利用者に事前の通知をすることなく、本サービスの内容の全部又は一部を変更、追加又は停止する場合があり、利用者はこれをあらかじめ承諾するものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第12条 （個人情報）</Typography>
        <Typography paragraph>
          当社は、利用者による本サービスの利用によって取得する個人情報を、当社のプライバシーポリシーに従い、適切に取り扱います。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第13条 （禁止事項）</Typography>
        <Typography paragraph>
          1 利用者は、次の行為を行うことはできません。
        </Typography>
        <Typography paragraph>
          (1) 本サービスの運営を妨げ、又はそのおそれのある行為
        </Typography>
        <Typography paragraph>
          (2) 他の利用者による本サービスの利用を妨害する行為
        </Typography>
        <Typography paragraph>
          (3) 本サービスにかかる著作権その他の権利を侵害する行為
        </Typography>
        <Typography paragraph>
          (4)
          当社、他の利用者又は第三者の権利又は利益（名誉権、プライバシー権及び著作権を含みますが、これらに限られません。）を侵害する行為
        </Typography>
        <Typography paragraph>
          (5) 公序良俗その他法令に違反する行為及びこれに違反する恐れのある行為
        </Typography>
        <Typography paragraph>(6) 本規約に違反する行為</Typography>
        <Typography paragraph>
          (7) 前各号の他、本サービスの趣旨に鑑みて当社が不適切と判断する行為
        </Typography>
        <Typography paragraph>
          2
          利用者が前項に定める行為を行ったと当社が判断した場合、当社は、利用者に事前に通知することなく、本サービスの全部又は一部の利用停止その他当社が必要かつ適切と判断する措置を講じることができます。本項の措置により利用者に生じる損害又は不利益について、当社は、一切の責任を負わないものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第14条 （反社会的勢力の排除）</Typography>
        <Typography paragraph>
          利用者は、当社に対し、次の事項を確約します。
        </Typography>
        <Typography paragraph>
          (1)
          自らが、暴力団、暴力団関係企業、総会屋若しくはこれらに準ずる者又はその構成員（以下総称して「反社会的勢力」といいます。）ではないこと。
        </Typography>
        <Typography paragraph>
          (2)
          自らの役員（業務を執行する社員、取締役、執行役又はこれらに準ずる者をいいます。）が反社会的勢力ではないこと。
        </Typography>
        <Typography paragraph>
          (3)
          反社会的勢力に自己の名義を利用させ、本契約を締結するものでないこと。
        </Typography>
        <Typography paragraph>
          (4) 自ら又は第三者を利用して、次の行為をしないこと。
        </Typography>
        <Typography paragraph>
          (a) 相手方に対する脅迫的な言動又は暴力を用いる行為
        </Typography>
        <Typography paragraph>(b) 法的な責任を超えた不当な要求行為</Typography>
        <Typography paragraph>
          (c) 偽計又は威力を用いて相手方の業務を妨害し、又は信用を毀損する行為
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第15条 （免責事項）</Typography>
        <Typography paragraph>
          1
          天災地変、戦争、テロ行為、暴動、労働争議、伝染病、法令の制定改廃、政府機関の介入その他不可抗力により、本サービスの全部又は一部の停止、中断、遅延が発生した場合、当社は、利用者に生じた損害又は不利益について一切責任を負いません。
        </Typography>
        <Typography paragraph>
          2
          利用者は、通信回線やコンピュータの障害、システムメンテナンスその他の事由による本サービスの全部又は一部の停止、中断、遅延が起こり得ることを理解しているものとし、当社は、これらにより利用者に生じた損害又は不利益について一切責任を負いません。また、利用者の利用環境によって生じた損害又は不利益について、当社は一切責任を負いません。
        </Typography>
        <Typography paragraph>
          3 当社は、以下の掲げる事項について、明示的にも黙示的にも保証しません。
        </Typography>
        <Typography paragraph>
          (1)
          本サービスの内容及び本サービスを通じて提供される情報の、有用性、完全性、正確性、最新性、信頼性、特定目的への適合性。
        </Typography>
        <Typography paragraph>
          (2)
          本サービスで提供される情報が第三者の権利を侵害しないものであること。
        </Typography>
        <Typography paragraph>
          (3) 本サービスが将来にわたって存続し続けること
        </Typography>
        <Typography paragraph>
          4
          当社は、理由の如何を問わず、データ等の全部又は一部が滅失、毀損、又は改ざんされた場合に、これを復元する義務を負わないものとし、当該滅失、毀損、又は改ざんによりお客さま又は第三者に生じた損害等について一切の責任を負わないものとします。
        </Typography>
        <Typography paragraph>
          5
          当社は、利用者による本サービスの利用に関連して、利用者に対して責任を負う場合には、該当の商品等の価額を超えて賠償する責任を負わないものとし、また、付随的損害、間接損害、特別損害、将来の損害および逸失利益にかかる損害については、賠償する責任を負わないものとします。
        </Typography>
        <Typography paragraph>
          6
          本条の他の条項にかかわらず、本サービスに関する当社と利用者との間の契約が消費者契約法に定める消費者契約となる場合であって、かつ、当社の故意又は重過失に起因するときは、免責規定は適用されません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第16条 （秘密保持）</Typography>
        <Typography paragraph>
          利用者は、本サービスの利用にあたり、当社より開示を受け、又は知り得た一切の情報について、第三者に開示又は漏えいしてはならず、本サービスの利用以外の目的に使用してはなりません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第17条 （当社からの通知）</Typography>
        <Typography paragraph>
          1
          当社から利用者に対して通知を行う場合、利用者が登録した電子メールアドレス宛に電子メールを送信する方法、本サービスに係るウェブサイト上への掲示その他当社が適当と判断する方法により行うものとします。
        </Typography>
        <Typography paragraph>
          2
          当社が通知を行う場合において、前項の電子メールアドレス宛に送信した場合、当該電子メールアドレスのメールサーバーに記録された時点で、当社の通知は利用者に到達したものとみなします。
        </Typography>
        <Typography paragraph>
          3
          利用者は、第1項の電子メールアドレスに変更がある場合、速やかに当社に通知するものとします。本項の変更の通知を受けるまでに当社が変更前の電子メールアドレス宛に送信した通知は、その発信の時点で利用者に到達したものとみなします。
        </Typography>
        <Typography paragraph>
          4
          利用者が前項に定める通知を怠ったことにより、利用者に損害又は不利益が生じたとしても、当社は何らの責任を負いません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第18条 （第三者との紛争）</Typography>
        <Typography paragraph>
          1
          本サービスに関連して利用者と第三者間で発生した紛争については、利用者は自らの費用と責任で解決するものとし、当社は一切の責任を負わないものとします。
        </Typography>
        <Typography paragraph>
          2
          前項に関し、当社が損害（弁護士費用を含みます。）を被った場合、利用者は当該損害を賠償するものとします。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第19条 （権利義務の譲渡禁止）</Typography>
        <Typography paragraph>
          利用者は、本規約に基づく契約上の地位及びこれにより生じる権利義務の全部または一部について、当社の書面による事前の承諾なく、第三者に対し、譲渡、移転、担保権の設定その他の処分をすることができません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第20条 （分離可能性）</Typography>
        <Typography paragraph>
          本規約のいずれかの条項が利用者との本規約に基づく契約に適用される法令に違反し、無効とされる場合、当該条項は、その違反とされる限りにおいて、当該利用者との契約には適用されないものとします。この場合でも、本規約の他の条項の効力には影響しません。
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第21条 （本規約の変更）</Typography>
        <Typography paragraph>
          当社は、本規約を変更する必要が生じた場合には、民法第548条の4（定型約款の変更）に基づき、本規約を変更することができます。本規約を変更する場合、当社は、その効力発生日を定め、効力発生日までに、電子メールの送信その他の方法により以下の事項を周知するものとします。
        </Typography>
        <Typography paragraph>(1) 本規約を変更する旨</Typography>
        <Typography paragraph>(2) 変更後の本規約の内容</Typography>
        <Typography paragraph>(3) 効力発生日</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="h6">第22条 （準拠法、裁判管轄）</Typography>
        <Typography paragraph>
          1 本規約は、日本法に準拠して解釈されます。
        </Typography>
        <Typography paragraph>
          2
          当社及び利用者は、本サービスに関し、当社と利用者との間で生じた紛争の解決について、東京地方裁判所を第一審の専属的合意管轄裁判所とすることにあらかじめ合意します。
        </Typography>
      </Box>
    </Box>
  );
};

export default KiyakuPage;
